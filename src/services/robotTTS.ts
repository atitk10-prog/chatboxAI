/**
 * Vietnamese Robot TTS - Chuyển văn bản tiếng Việt thành giọng robot
 * Sử dụng Web Audio API để tạo hiệu ứng giọng robot
 */

// Map các nguyên âm tiếng Việt sang tần số âm thanh
const VOWEL_FREQUENCIES: Record<string, number> = {
    'a': 440, 'à': 400, 'á': 480, 'ả': 420, 'ã': 460, 'ạ': 380,
    'ă': 450, 'ằ': 410, 'ắ': 490, 'ẳ': 430, 'ẵ': 470, 'ặ': 390,
    'â': 460, 'ầ': 420, 'ấ': 500, 'ẩ': 440, 'ẫ': 480, 'ậ': 400,
    'e': 520, 'è': 480, 'é': 560, 'ẻ': 500, 'ẽ': 540, 'ẹ': 460,
    'ê': 540, 'ề': 500, 'ế': 580, 'ể': 520, 'ễ': 560, 'ệ': 480,
    'i': 660, 'ì': 620, 'í': 700, 'ỉ': 640, 'ĩ': 680, 'ị': 600,
    'o': 350, 'ò': 310, 'ó': 390, 'ỏ': 330, 'õ': 370, 'ọ': 290,
    'ô': 370, 'ồ': 330, 'ố': 410, 'ổ': 350, 'ỗ': 390, 'ộ': 310,
    'ơ': 380, 'ờ': 340, 'ớ': 420, 'ở': 360, 'ỡ': 400, 'ợ': 320,
    'u': 300, 'ù': 260, 'ú': 340, 'ủ': 280, 'ũ': 320, 'ụ': 240,
    'ư': 320, 'ừ': 280, 'ứ': 360, 'ử': 300, 'ữ': 340, 'ự': 260,
    'y': 640, 'ỳ': 600, 'ý': 680, 'ỷ': 620, 'ỹ': 660, 'ỵ': 580,
};

const CONSONANT_NOISE_DURATION = 0.04;
const VOWEL_DURATION = 0.12;
const SPACE_PAUSE = 0.15;
const SENTENCE_PAUSE = 0.3;

export class RobotTTS {
    private audioContext: AudioContext | null = null;
    private isPlaying = false;
    private stopRequested = false;

    private getContext(): AudioContext {
        if (!this.audioContext || this.audioContext.state === 'closed') {
            this.audioContext = new AudioContext();
        }
        return this.audioContext;
    }

    /**
     * Phát một nốt âm thanh robot
     */
    private playTone(
        ctx: AudioContext,
        startTime: number,
        frequency: number,
        duration: number,
        type: OscillatorType = 'square',
        volume: number = 0.15
    ): number {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator(); // Low Frequency Oscillator cho hiệu ứng robot
        const lfoGain = ctx.createGain();

        // Hiệu ứng vibrato robot
        lfo.frequency.value = 12;
        lfoGain.gain.value = frequency * 0.03;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.type = type;
        osc.frequency.value = frequency;

        // Envelope: attack → sustain → release
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gain.gain.setValueAtTime(volume, startTime + duration - 0.02);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
        lfo.start(startTime);
        lfo.stop(startTime + duration);

        return startTime + duration;
    }

    /**
     * Phát âm thanh nhiễu cho phụ âm
     */
    private playNoise(
        ctx: AudioContext,
        startTime: number,
        duration: number,
        frequency: number = 2000
    ): number {
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = frequency;
        filter.Q.value = 5;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.005);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start(startTime);
        source.stop(startTime + duration);

        return startTime + duration;
    }

    /**
     * Phát tiếng beep intro/outro robot
     */
    private playBeep(ctx: AudioContext, startTime: number, notes: number[], noteDuration: number = 0.08): number {
        let time = startTime;
        for (const freq of notes) {
            this.playTone(ctx, time, freq, noteDuration, 'square', 0.1);
            time += noteDuration;
        }
        return time;
    }

    /**
     * Chuyển text thành chuỗi âm thanh robot
     */
    async speak(text: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
        if (this.isPlaying) {
            this.stop();
            // Đợi một chút để stop hoàn thành
            await new Promise(r => setTimeout(r, 100));
        }

        this.isPlaying = true;
        this.stopRequested = false;
        onStart?.();

        const ctx = this.getContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const chars = text.toLowerCase().split('');
        let currentTime = ctx.currentTime + 0.05;

        // Intro beep - tiếng robot bật lên
        currentTime = this.playBeep(ctx, currentTime, [880, 1100, 1320], 0.06);
        currentTime += 0.1;

        for (let i = 0; i < chars.length; i++) {
            if (this.stopRequested) break;

            const char = chars[i];

            if (char === ' ') {
                currentTime += SPACE_PAUSE;
                continue;
            }

            if (char === '.' || char === '!' || char === '?') {
                // Câu kết thúc - thêm beep nhỏ
                this.playTone(ctx, currentTime, char === '?' ? 600 : 400, 0.08, 'sine', 0.08);
                currentTime += SENTENCE_PAUSE;
                continue;
            }

            if (char === ',' || char === ':' || char === ';') {
                currentTime += SPACE_PAUSE * 0.8;
                continue;
            }

            const vowelFreq = VOWEL_FREQUENCIES[char];
            if (vowelFreq) {
                // Nguyên âm → phát tone
                this.playTone(ctx, currentTime, vowelFreq, VOWEL_DURATION, 'square', 0.13);
                // Thêm harmonic cho giọng rõ hơn
                this.playTone(ctx, currentTime, vowelFreq * 1.5, VOWEL_DURATION, 'sine', 0.04);
                currentTime += VOWEL_DURATION + 0.01;
            } else if (/[a-zđ]/i.test(char)) {
                // Phụ âm → phát noise
                const noiseFreq = char.charCodeAt(0) * 15 + 800;
                this.playNoise(ctx, currentTime, CONSONANT_NOISE_DURATION, noiseFreq);
                currentTime += CONSONANT_NOISE_DURATION;
            }
            // Bỏ qua ký tự đặc biệt khác
        }

        // Outro beep
        currentTime += 0.05;
        this.playBeep(ctx, currentTime, [1320, 1100, 880], 0.06);
        currentTime += 0.2;

        // Đợi cho đến khi phát xong
        const totalDuration = (currentTime - ctx.currentTime) * 1000;
        await new Promise<void>((resolve) => {
            const checkInterval = setInterval(() => {
                if (this.stopRequested || ctx.currentTime >= currentTime) {
                    clearInterval(checkInterval);
                    this.isPlaying = false;
                    onEnd?.();
                    resolve();
                }
            }, 100);
        });
    }

    /**
     * Dừng phát
     */
    stop(): void {
        this.stopRequested = true;
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.isPlaying = false;
    }

    /**
     * Kiểm tra đang phát hay không
     */
    get playing(): boolean {
        return this.isPlaying;
    }
}

// Singleton instance
export const robotTTS = new RobotTTS();
