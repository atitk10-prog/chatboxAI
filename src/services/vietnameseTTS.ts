/**
 * Vietnamese TTS Service - Google Translate TTS
 * Proxy qua Vite dev server (/api/tts)
 */

const MAX_CHUNK_LENGTH = 80;
const CHUNK_DELAY = 300;
const CHUNK_TIMEOUT = 15000; // 15s timeout per chunk

function splitTextIntoChunks(text: string): string[] {
    let cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    cleanText = cleanText.replace(/\bAI\b/g, 'Ây Ai').replace(/\bOK\b/gi, 'ô kê');
    if (!cleanText) return [];
    if (cleanText.length <= MAX_CHUNK_LENGTH) return [cleanText];

    const chunks: string[] = [];
    const parts = cleanText.split(/(?<=[.!?,])\s*/);
    let currentChunk = '';
    for (const part of parts) {
        if (!part.trim()) continue;
        if (part.length > MAX_CHUNK_LENGTH) {
            if (currentChunk) { chunks.push(currentChunk.trim()); currentChunk = ''; }
            const words = part.split(/\s+/);
            for (const word of words) {
                if ((currentChunk + ' ' + word).trim().length > MAX_CHUNK_LENGTH) {
                    if (currentChunk) chunks.push(currentChunk.trim());
                    currentChunk = word;
                } else {
                    currentChunk = (currentChunk + ' ' + word).trim();
                }
            }
        } else if ((currentChunk + ' ' + part).trim().length > MAX_CHUNK_LENGTH) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = part;
        } else {
            currentChunk = (currentChunk + ' ' + part).trim();
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks.filter(c => c.length > 0);
}

export class VietnameseTTS {
    private isPlaying = false;
    private stopRequested = false;
    private currentAudio: HTMLAudioElement | null = null;
    // Generation counter: mỗi lần speak() được gọi, tăng lên 1
    // Nếu generation thay đổi giữa chừng → chunk cũ tự cancel
    private generation = 0;

    private buildUrl(chunk: string): string {
        const encoded = encodeURIComponent(chunk);
        return `/api/tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encoded}&_t=${Date.now()}`;
    }

    private playChunk(chunk: string, gen: number, retries = 2): Promise<boolean> {
        return new Promise(resolve => {
            // Nếu generation đã thay đổi → skip chunk này
            if (this.stopRequested || this.generation !== gen) {
                resolve(false);
                return;
            }

            const audio = new Audio(this.buildUrl(chunk));
            this.currentAudio = audio;

            const done = (success: boolean) => {
                audio.onended = null;
                audio.onerror = null;
                audio.oncanplay = null;
                if (!success) {
                    try { audio.pause(); } catch { }
                }
                if (this.currentAudio === audio) this.currentAudio = null;
                resolve(success);
            };

            const timeout = setTimeout(() => {
                console.warn('TTS timeout:', chunk.substring(0, 30));
                done(false);
            }, CHUNK_TIMEOUT);

            audio.onended = () => { clearTimeout(timeout); done(true); };
            audio.onerror = () => {
                clearTimeout(timeout);
                if (retries > 0 && !this.stopRequested && this.generation === gen) {
                    if (this.currentAudio === audio) this.currentAudio = null;
                    setTimeout(() => this.playChunk(chunk, gen, retries - 1).then(resolve), 500);
                } else {
                    console.warn('TTS failed:', chunk.substring(0, 30));
                    done(false);
                }
            };

            audio.play().catch(() => {
                clearTimeout(timeout);
                if (retries > 0 && !this.stopRequested && this.generation === gen) {
                    if (this.currentAudio === audio) this.currentAudio = null;
                    setTimeout(() => this.playChunk(chunk, gen, retries - 1).then(resolve), 500);
                } else {
                    done(false);
                }
            });
        });
    }

    async speak(text: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
        // Always stop previous before starting new
        this.stop();
        if (!text?.trim()) { onEnd?.(); return; }

        // Small gap to let previous audio fully release
        await new Promise(r => setTimeout(r, 50));

        // Bắt đầu generation mới
        const gen = ++this.generation;
        this.isPlaying = true;
        this.stopRequested = false;
        onStart?.();

        try {
            const chunks = splitTextIntoChunks(text);
            console.log(`🔊 TTS: ${chunks.length} chunks for: "${text.substring(0, 50)}..."`);

            for (let i = 0; i < chunks.length; i++) {
                // Check cả stopRequested VÀ generation
                if (this.stopRequested || this.generation !== gen) {
                    console.log('🔇 TTS stopped (gen mismatch or stop requested)');
                    break;
                }

                const success = await this.playChunk(chunks[i], gen);
                console.log(`  chunk ${i + 1}/${chunks.length}: ${success ? '✅' : '❌'}`);

                // Delay between chunks
                if (i < chunks.length - 1 && !this.stopRequested && this.generation === gen) {
                    await new Promise(r => setTimeout(r, CHUNK_DELAY));
                }
            }
        } catch (e) {
            console.error('TTS error:', e);
        } finally {
            // Chỉ cập nhật state nếu vẫn là generation hiện tại
            if (this.generation === gen) {
                this.isPlaying = false;
            }
            onEnd?.();
        }
    }

    /**
     * speakAsync - Giống speak() nhưng trả về Promise
     * Dùng cho sequential TTS: await speakAsync("lời khen") → await speakAsync("câu hỏi")
     */
    speakAsync(text: string): Promise<void> {
        return new Promise<void>((resolve) => {
            this.speak(text, undefined, () => resolve());
        });
    }

    stop(): void {
        this.stopRequested = true;
        // Tăng generation để cancel tất cả chunk đang pending
        this.generation++;
        if (this.currentAudio) {
            try {
                this.currentAudio.onended = null;
                this.currentAudio.onerror = null;
                this.currentAudio.pause();
            } catch { }
            this.currentAudio = null;
        }
        this.isPlaying = false;
    }

    get playing(): boolean { return this.isPlaying; }
}

export const vietnameseTTS = new VietnameseTTS();
