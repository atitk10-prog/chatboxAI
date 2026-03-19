// Bộ câu hỏi offline - bốc ngẫu nhiên, không cần gọi API
// Mỗi chủ đề 50 câu, từ dễ → khó

export interface Question {
    id: number;
    story: string;      // Câu chuyện + câu hỏi
    answer: number;      // Đáp án đúng
    difficulty: 1 | 2 | 3; // 1=dễ, 2=TB, 3=khó
}

// ── RỪNG XANH KỲ BÍ (bảng nhân 2-9, chủ đề thiên nhiên) ──
const FOREST_QUESTIONS: Question[] = [
    { id: 1, story: "Hiệp sĩ ơi! Có 2 chú thỏ đang ngồi ăn cà rốt, mỗi chú ôm 2 củ. Hỏi có tất cả bao nhiêu củ cà rốt?", answer: 4, difficulty: 1 },
    { id: 2, story: "Trên cành cây có 2 tổ chim, mỗi tổ có 3 chú chim non đang hót. Hỏi có bao nhiêu chú chim?", answer: 6, difficulty: 1 },
    { id: 3, story: "Chú Sóc chăm chỉ hái được 2 giỏ hạt dẻ, mỗi giỏ chứa 4 hạt. Hỏi có bao nhiêu hạt dẻ?", answer: 8, difficulty: 1 },
    { id: 4, story: "Có 3 chú nai đang dạo chơi, mỗi chú mang 3 quả táo rừng. Hỏi có bao nhiêu quả táo?", answer: 9, difficulty: 1 },
    { id: 5, story: "Bên suối có 2 cây cổ thụ, mỗi cây có 5 tổ chim. Hỏi có bao nhiêu tổ chim?", answer: 10, difficulty: 1 },
    { id: 6, story: "Có 3 hươu cao cổ ăn lá, mỗi chú ăn 4 chiếc lá. Hỏi tổng cộng ăn bao nhiêu lá?", answer: 12, difficulty: 1 },
    { id: 7, story: "Hiệp sĩ gặp 2 đàn bướm bay qua, mỗi đàn có 7 con rực rỡ. Hỏi có bao nhiêu bướm?", answer: 14, difficulty: 1 },
    { id: 8, story: "Trong rừng có 3 bụi hoa, mỗi bụi nở 5 bông hoa. Hỏi tổng cộng bao nhiêu bông?", answer: 15, difficulty: 1 },
    { id: 9, story: "Có 2 gia đình gấu sống bên suối, mỗi gia đình có 8 con. Hỏi có bao nhiêu con gấu?", answer: 16, difficulty: 1 },
    { id: 10, story: "Bác thợ rừng trồng 2 hàng cây, mỗi hàng 9 cây xanh tốt. Hỏi trồng bao nhiêu cây?", answer: 18, difficulty: 1 },
    { id: 11, story: "Có 4 đàn kiến hành quân, mỗi đàn 5 con kiến lính. Hỏi có bao nhiêu kiến lính?", answer: 20, difficulty: 1 },
    { id: 12, story: "Phượng hoàng đẻ 3 tổ trứng, mỗi tổ 7 quả trứng vàng. Hỏi có bao nhiêu trứng?", answer: 21, difficulty: 1 },
    { id: 13, story: "Hiệp sĩ đi qua 4 đàn bướm, mỗi đàn 6 con đang bay lượn. Hỏi có bao nhiêu bướm?", answer: 24, difficulty: 2 },
    { id: 14, story: "Trong rừng có 5 cây ăn quả, mỗi cây cho 5 quả chín mọng. Hỏi có bao nhiêu quả?", answer: 25, difficulty: 2 },
    { id: 15, story: "Có 3 hang thỏ, mỗi hang chứa 9 chú thỏ con đáng yêu. Hỏi có bao nhiêu thỏ?", answer: 27, difficulty: 2 },
    { id: 16, story: "Bên hồ nước có 4 đàn vịt bơi lội, mỗi đàn 7 con vịt. Hỏi có bao nhiêu con vịt?", answer: 28, difficulty: 2 },
    { id: 17, story: "Có 5 cây cổ thụ cao vút, mỗi cây treo 6 tổ ong mật vàng. Hỏi có bao nhiêu tổ ong?", answer: 30, difficulty: 2 },
    { id: 18, story: "Hiệp sĩ tìm thấy 4 kho báu, mỗi kho chứa 8 hòm vàng lấp lánh. Hỏi có bao nhiêu hòm?", answer: 32, difficulty: 2 },
    { id: 19, story: "Có 5 đầm sen tuyệt đẹp, mỗi đầm nở 7 bông sen hồng thơm. Hỏi có bao nhiêu bông sen?", answer: 35, difficulty: 2 },
    { id: 20, story: "Trong rừng có 6 bầy sói, mỗi bầy gồm 6 con sói dũng mãnh. Hỏi có bao nhiêu sói?", answer: 36, difficulty: 2 },
    { id: 21, story: "Có 5 khu rừng tre xanh, mỗi khu nuôi 8 chú gấu trúc quý hiếm. Hỏi có bao nhiêu gấu trúc?", answer: 40, difficulty: 2 },
    { id: 22, story: "Bên suối có 6 hang gấu, mỗi hang chứa 7 hũ mật ong thơm lừng. Hỏi có bao nhiêu hũ mật?", answer: 42, difficulty: 2 },
    { id: 23, story: "Có 5 ngọn đồi xanh mướt, mỗi đồi có 9 cây hoa anh đào nở rộ. Hỏi có bao nhiêu cây?", answer: 45, difficulty: 2 },
    { id: 24, story: "Hiệp sĩ gặp 6 con voi, mỗi con mang 8 khúc gỗ xây cầu. Hỏi có bao nhiêu khúc gỗ?", answer: 48, difficulty: 2 },
    { id: 25, story: "Rừng phép thuật có 4 cửa, mỗi cửa cần 8 chìa khóa vàng. Hỏi cần bao nhiêu chìa khóa?", answer: 32, difficulty: 2 },
    { id: 26, story: "Có 6 dòng suối chảy qua rừng, mỗi suối có 5 hòn đá quý ẩn giấu. Hỏi có bao nhiêu đá quý?", answer: 30, difficulty: 2 },
    { id: 27, story: "Trên 4 ngọn núi cao có 9 hang động bí mật mỗi ngọn. Hỏi có bao nhiêu hang động?", answer: 36, difficulty: 2 },
    { id: 28, story: "Có 7 con khỉ tinh nghịch, mỗi con ôm 4 quả chuối chín vàng. Hỏi có bao nhiêu quả chuối?", answer: 28, difficulty: 2 },
    { id: 29, story: "Khu rừng có 5 thác nước hùng vĩ, dưới mỗi thác có 6 con cá vàng bơi lội. Hỏi có bao nhiêu cá?", answer: 30, difficulty: 2 },
    { id: 30, story: "Hiệp sĩ thu thập 8 rổ nấm, mỗi rổ 4 cây nấm tươi ngon. Hỏi có bao nhiêu cây nấm?", answer: 32, difficulty: 2 },
    { id: 31, story: "Có 7 con đại bàng hùng mạnh, mỗi con bắt 7 con cá từ suối. Hỏi bắt được bao nhiêu cá?", answer: 49, difficulty: 3 },
    { id: 32, story: "Rừng có 6 khu vực nguy hiểm, mỗi khu có 9 cái bẫy cần tránh. Hỏi có bao nhiêu cái bẫy?", answer: 54, difficulty: 3 },
    { id: 33, story: "Có 7 con rồng rừng xanh, mỗi con canh giữ 8 viên ngọc quý. Hỏi có bao nhiêu viên ngọc?", answer: 56, difficulty: 3 },
    { id: 34, story: "Vua rừng lập 9 đội hiệp sĩ tuần tra, mỗi đội 7 chiến binh dũng cảm. Hỏi có bao nhiêu chiến binh?", answer: 63, difficulty: 3 },
    { id: 35, story: "Cây thần kỳ mọc 8 cành lớn, mỗi cành mang 8 quả phép thuật lấp lánh. Hỏi có bao nhiêu quả?", answer: 64, difficulty: 3 },
    { id: 36, story: "Có 8 con hổ canh rừng, mỗi con bảo vệ 9 khu vườn quý. Hỏi bảo vệ bao nhiêu khu vườn?", answer: 72, difficulty: 3 },
    { id: 37, story: "Rừng thần tiên có 9 nàng tiên, mỗi nàng trồng 9 cây hoa thần. Hỏi có bao nhiêu cây hoa?", answer: 81, difficulty: 3 },
    { id: 38, story: "Có 7 bầy chim thiên nga, mỗi bầy 6 con đang bơi trên hồ. Hỏi có bao nhiêu thiên nga?", answer: 42, difficulty: 3 },
    { id: 39, story: "Hiệp sĩ vượt 8 cánh rừng, mỗi rừng có 6 thử thách cần vượt qua. Hỏi có bao nhiêu thử thách?", answer: 48, difficulty: 3 },
    { id: 40, story: "Có 9 con rùa thần, trên mai mỗi con gắn 6 viên đá quý cổ đại. Hỏi có bao nhiêu viên đá?", answer: 54, difficulty: 3 },
    { id: 41, story: "Trong rừng đêm có 8 cây nấm phát sáng, mỗi cây tỏa ra 7 tia sáng. Hỏi có bao nhiêu tia sáng?", answer: 56, difficulty: 3 },
    { id: 42, story: "Có 9 hang rồng bí ẩn, mỗi hang chứa 7 kho vàng. Hỏi có bao nhiêu kho vàng?", answer: 63, difficulty: 3 },
    { id: 43, story: "Rừng cấm có 9 cổng, mỗi cổng cần 8 lời thần chú để mở. Hỏi cần bao nhiêu lời thần chú?", answer: 72, difficulty: 3 },
    { id: 44, story: "Có 3 đàn công xòe đuôi, mỗi đàn 8 chú công rực rỡ. Hỏi có bao nhiêu chú công?", answer: 24, difficulty: 1 },
    { id: 45, story: "Bác gấu hái 4 rổ mật ong, mỗi rổ 4 hũ mật vàng óng. Hỏi có bao nhiêu hũ mật?", answer: 16, difficulty: 1 },
    { id: 46, story: "Có 6 con cáo đang chơi trốn tìm, mỗi con giấu 8 quả trứng. Hỏi giấu bao nhiêu trứng?", answer: 48, difficulty: 2 },
    { id: 47, story: "Hiệp sĩ gặp 7 cây cầu vồng, mỗi cầu có 9 sắc màu kỳ diệu. Hỏi có bao nhiêu sắc màu?", answer: 63, difficulty: 3 },
    { id: 48, story: "Có 8 tổ ong khổng lồ, mỗi tổ có 8 ong chúa đang cai trị. Hỏi có bao nhiêu ong chúa?", answer: 64, difficulty: 3 },
    { id: 49, story: "Rừng có 9 ngọn núi thiêng, trên mỗi ngọn có 8 đền thờ cổ xưa. Hỏi có bao nhiêu đền thờ?", answer: 72, difficulty: 3 },
    { id: 50, story: "Trận chiến cuối! Có 9 đội quân rừng xanh, mỗi đội 9 chiến binh. Hỏi có bao nhiêu chiến binh?", answer: 81, difficulty: 3 },
];

// ── VŨ TRỤ BAO LA (bảng nhân 2-9, chủ đề không gian) ──
const SPACE_QUESTIONS: Question[] = [
    { id: 1, story: "Hiệp sĩ bay qua 2 hành tinh, mỗi hành tinh có 3 trạm nghiên cứu. Hỏi có bao nhiêu trạm?", answer: 6, difficulty: 1 },
    { id: 2, story: "Có 2 phi thuyền, mỗi phi thuyền chở 4 phi hành gia. Hỏi có bao nhiêu phi hành gia?", answer: 8, difficulty: 1 },
    { id: 3, story: "Trên bầu trời có 3 ngôi sao, mỗi ngôi sao có 3 hành tinh quay quanh. Hỏi có bao nhiêu hành tinh?", answer: 9, difficulty: 1 },
    { id: 4, story: "Có 2 trạm không gian, mỗi trạm có 5 căn phòng. Hỏi có bao nhiêu phòng?", answer: 10, difficulty: 1 },
    { id: 5, story: "Có 2 thiên hà, mỗi thiên hà có 6 chòm sao lấp lánh. Hỏi có bao nhiêu chòm sao?", answer: 12, difficulty: 1 },
    { id: 6, story: "Trên hành tinh Xanh có 2 nhóm thám hiểm, mỗi nhóm 7 người. Hỏi có bao nhiêu người?", answer: 14, difficulty: 1 },
    { id: 7, story: "Có 2 mặt trăng lạ, mỗi mặt trăng có 8 miệng núi lửa. Hỏi có bao nhiêu núi lửa?", answer: 16, difficulty: 1 },
    { id: 8, story: "Có 3 tàu vũ trụ, mỗi tàu chở 6 hộp hàng tiếp tế. Hỏi có bao nhiêu hộp hàng?", answer: 18, difficulty: 1 },
    { id: 9, story: "Căn cứ có 4 robot, mỗi robot có 5 cánh tay cơ khí. Hỏi có bao nhiêu cánh tay?", answer: 20, difficulty: 1 },
    { id: 10, story: "Có 3 cụm sao mới, mỗi cụm có 7 hành tinh nhỏ. Hỏi có bao nhiêu hành tinh nhỏ?", answer: 21, difficulty: 1 },
    { id: 11, story: "Có 2 thiên thạch, mỗi thiên thạch vỡ thành 9 mảnh nhỏ. Hỏi có bao nhiêu mảnh?", answer: 18, difficulty: 1 },
    { id: 12, story: "Có 3 phi thuyền, mỗi tàu trang bị 8 vũ khí laser. Hỏi có bao nhiêu vũ khí?", answer: 24, difficulty: 1 },
    { id: 13, story: "Quái vật cử 5 đội quân, mỗi đội 5 lính chiến. Hỏi có bao nhiêu lính?", answer: 25, difficulty: 2 },
    { id: 14, story: "Có 4 kho vũ khí bí mật, mỗi kho chứa 7 khẩu súng laser. Hỏi có bao nhiêu súng?", answer: 28, difficulty: 2 },
    { id: 15, story: "Có 6 hành tinh bị chiếm, mỗi hành tinh cần 5 chiến binh giải cứu. Hỏi cần bao nhiêu chiến binh?", answer: 30, difficulty: 2 },
    { id: 16, story: "Có 4 trạm radar, mỗi trạm phát hiện 8 vật thể lạ. Hỏi phát hiện bao nhiêu vật thể?", answer: 32, difficulty: 2 },
    { id: 17, story: "Hạm đội gồm 5 phi thuyền, mỗi phi thuyền có 7 vũ khí tối tân. Hỏi có bao nhiêu vũ khí?", answer: 35, difficulty: 2 },
    { id: 18, story: "Có 6 robot chiến đấu, mỗi robot nạp 6 viên năng lượng. Hỏi cần bao nhiêu viên?", answer: 36, difficulty: 2 },
    { id: 19, story: "Có 5 bãi đáp trên hành tinh Đỏ, mỗi bãi chứa 8 phi thuyền. Hỏi có bao nhiêu phi thuyền?", answer: 40, difficulty: 2 },
    { id: 20, story: "Có 6 đội thám hiểm, mỗi đội 7 thành viên dũng cảm. Hỏi có bao nhiêu thành viên?", answer: 42, difficulty: 2 },
    { id: 21, story: "Có 5 lớp phòng thủ, mỗi lớp có 9 tháp canh kiên cố. Hỏi có bao nhiêu tháp canh?", answer: 45, difficulty: 2 },
    { id: 22, story: "Có 6 kho tàng vũ trụ, mỗi kho chứa 8 rương vàng. Hỏi có bao nhiêu rương vàng?", answer: 48, difficulty: 2 },
    { id: 23, story: "Có 4 vùng thiên hà, mỗi vùng 9 ngôi sao tỏa sáng. Hỏi có bao nhiêu ngôi sao?", answer: 36, difficulty: 2 },
    { id: 24, story: "Có 5 siêu robot, mỗi robot trang bị 6 vũ khí đặc biệt. Hỏi có bao nhiêu vũ khí?", answer: 30, difficulty: 2 },
    { id: 25, story: "Hiệp sĩ hoàn thành 7 nhiệm vụ, mỗi nhiệm vụ thưởng 4 điểm. Hỏi được bao nhiêu điểm?", answer: 28, difficulty: 2 },
    { id: 26, story: "Có 6 phi công, mỗi người bay 5 chuyến thám hiểm xa xôi. Hỏi có bao nhiêu chuyến?", answer: 30, difficulty: 2 },
    { id: 27, story: "Có 5 nhóm khoa học, mỗi nhóm thu 8 mẫu vật quý giá. Hỏi thu bao nhiêu mẫu vật?", answer: 40, difficulty: 2 },
    { id: 28, story: "Có 7 cơn bão vũ trụ, mỗi cơn kéo dài 6 giờ. Hỏi tổng bao nhiêu giờ?", answer: 42, difficulty: 2 },
    { id: 29, story: "Có 5 vũ khí siêu cấp, mỗi vũ khí cần 9 viên pin năng lượng. Hỏi cần bao nhiêu pin?", answer: 45, difficulty: 2 },
    { id: 30, story: "Đi qua 7 tầng không gian, mỗi tầng có 4 cánh cửa cần mở. Hỏi có bao nhiêu cửa?", answer: 28, difficulty: 2 },
    { id: 31, story: "Có 7 kẻ thù, mỗi kẻ có 7 tay sai trung thành. Hỏi có bao nhiêu tay sai?", answer: 49, difficulty: 3 },
    { id: 32, story: "Có 6 trạm tiếp nhiên liệu, mỗi trạm có 9 máy bơm hiện đại. Hỏi có bao nhiêu máy bơm?", answer: 54, difficulty: 3 },
    { id: 33, story: "Có 8 hạm đội, mỗi hạm đội 7 tàu chiến hùng mạnh. Hỏi có bao nhiêu tàu chiến?", answer: 56, difficulty: 3 },
    { id: 34, story: "Có 7 cuộc chiến vũ trụ, mỗi cuộc có 9 trận đánh ác liệt. Hỏi có bao nhiêu trận đánh?", answer: 63, difficulty: 3 },
    { id: 35, story: "Có 8 con quái vật khổng lồ, mỗi con phun 8 viên đạn lửa. Hỏi có bao nhiêu viên đạn?", answer: 64, difficulty: 3 },
    { id: 36, story: "Có 8 căn cứ bí mật, mỗi căn cứ 9 lối vào ngụy trang. Hỏi có bao nhiêu lối vào?", answer: 72, difficulty: 3 },
    { id: 37, story: "Có 9 vòng bảo vệ, mỗi vòng gồm 9 lá chắn năng lượng. Hỏi có bao nhiêu lá chắn?", answer: 81, difficulty: 3 },
    { id: 38, story: "Có 7 chiến binh ánh sáng, mỗi người có 8 chiêu thức. Hỏi có bao nhiêu chiêu thức?", answer: 56, difficulty: 3 },
    { id: 39, story: "Có 9 hệ sao, mỗi hệ có 6 hành tinh quay quanh. Hỏi có bao nhiêu hành tinh?", answer: 54, difficulty: 3 },
    { id: 40, story: "Có 6 cổng dịch chuyển, mỗi cổng dẫn đến 8 chiều không gian. Hỏi có bao nhiêu chiều?", answer: 48, difficulty: 3 },
    { id: 41, story: "Có 7 hành tinh nguy hiểm, mỗi hành tinh 9 khu vực bẫy rập. Hỏi có bao nhiêu khu vực?", answer: 63, difficulty: 3 },
    { id: 42, story: "Có 8 đội cận vệ, mỗi đội 9 thành viên tinh nhuệ. Hỏi có bao nhiêu cận vệ?", answer: 72, difficulty: 3 },
    { id: 43, story: "Có 9 nhà khoa học, mỗi người phát minh 8 thiết bị mới. Hỏi có bao nhiêu thiết bị?", answer: 72, difficulty: 3 },
    { id: 44, story: "Có 3 quả cầu năng lượng, mỗi quả chứa 4 đơn vị năng lượng. Hỏi có bao nhiêu đơn vị?", answer: 12, difficulty: 1 },
    { id: 45, story: "Có 4 tàu trinh sát, mỗi tàu mang 6 tên lửa. Hỏi có bao nhiêu tên lửa?", answer: 24, difficulty: 1 },
    { id: 46, story: "Có 5 đoàn thám hiểm, mỗi đoàn 9 thành viên. Hỏi có bao nhiêu thành viên?", answer: 45, difficulty: 2 },
    { id: 47, story: "Có 8 tướng quái vật, mỗi tướng chỉ huy 7 đội quân. Hỏi có bao nhiêu đội quân?", answer: 56, difficulty: 3 },
    { id: 48, story: "Có 9 pháo đài vũ trụ, mỗi pháo đài 8 khẩu đại bác. Hỏi có bao nhiêu đại bác?", answer: 72, difficulty: 3 },
    { id: 49, story: "Có 7 vùng nguy hiểm, mỗi vùng 8 quái vật canh gác. Hỏi có bao nhiêu quái vật?", answer: 56, difficulty: 3 },
    { id: 50, story: "Trận chiến cuối! 9 đội quân, mỗi đội 9 chiến binh thiện chiến. Hỏi có bao nhiêu chiến binh?", answer: 81, difficulty: 3 },
];

// ── LÂU ĐÀI PHÉP THUẬT (bảng nhân 2-9, chủ đề hiệp sĩ & phép thuật) ──
const CASTLE_QUESTIONS: Question[] = [
    { id: 1, story: "Hiệp sĩ ơi! Phù thủy xấu xa đã triệu hồi 2 đội yêu tinh để canh giữ lâu đài, mỗi đội gồm 8 con yêu tinh. Hỏi tổng cộng có bao nhiêu con yêu tinh?", answer: 16, difficulty: 1 },
    { id: 2, story: "Bên trong lâu đài cổ có 2 căn phòng lớn được trang trí lộng lẫy, mỗi phòng thắp sáng bằng 9 cây nến. Hỏi tổng cộng có bao nhiêu cây nến?", answer: 18, difficulty: 1 },
    { id: 3, story: "Quanh lâu đài có 3 tháp canh cao vút, trên mỗi tháp có 8 hiệp sĩ đang đứng gác ngày đêm. Hỏi tổng cộng có bao nhiêu hiệp sĩ gác?", answer: 24, difficulty: 1 },
    { id: 4, story: "Trong khuôn viên lâu đài có 2 khu vườn hoa phép thuật tuyệt đẹp, mỗi vườn trồng 9 bông hoa phát sáng. Hỏi tổng cộng có bao nhiêu bông hoa?", answer: 18, difficulty: 1 },
    { id: 5, story: "Sâu dưới hầm lâu đài có 3 con rồng lửa đang canh giữ kho báu hoàng gia, mỗi con bảo vệ 9 rương kho báu. Hỏi tổng cộng có bao nhiêu rương kho báu?", answer: 27, difficulty: 1 },
    { id: 6, story: "Hoàng tử dũng cảm có 2 chiếc hộp phép thuật quý giá, bên trong mỗi hộp chứa 8 viên ngọc trai sáng lấp lánh. Hỏi tổng cộng có bao nhiêu viên ngọc trai?", answer: 16, difficulty: 1 },
    { id: 7, story: "Trong đại sảnh hoàng gia đang diễn ra bữa tiệc lớn với 3 bàn tiệc sang trọng, mỗi bàn mời 8 vị khách quý. Hỏi tổng cộng có bao nhiêu vị khách?", answer: 24, difficulty: 1 },
    { id: 8, story: "Nhà vua đã cử 2 đoàn kỵ sĩ đi tuần tra quanh vương quốc, mỗi đoàn gồm 8 kỵ sĩ cưỡi ngựa. Hỏi tổng cộng có bao nhiêu kỵ sĩ?", answer: 16, difficulty: 1 },
    { id: 9, story: "Công chúa xinh đẹp sở hữu 3 bộ trang sức quý giá được truyền từ đời trước, mỗi bộ gồm 9 viên đá quý. Hỏi tổng cộng có bao nhiêu viên đá quý?", answer: 27, difficulty: 1 },
    { id: 10, story: "Để vào lâu đài phải đi qua 2 cánh cổng khổng lồ bị khóa chặt, mỗi cánh cổng cần đúng 9 chiếc chìa khóa để mở. Hỏi tổng cộng cần bao nhiêu chiếc chìa khóa?", answer: 18, difficulty: 1 },
    { id: 11, story: "Lâu đài có 5 phòng kho rộng lớn chứa đầy vàng bạc, mỗi phòng xếp 8 rương vàng nặng trĩu. Hỏi tổng cộng có bao nhiêu rương vàng?", answer: 40, difficulty: 2 },
    { id: 12, story: "Đội quân bảo vệ lâu đài gồm 4 tiểu đội tinh nhuệ, mỗi tiểu đội có 9 chiến binh thiện chiến. Hỏi tổng cộng có bao nhiêu chiến binh?", answer: 36, difficulty: 2 },
    { id: 13, story: "Phù thủy lớn tuổi sở hữu 6 cuốn sách phép thuật cổ xưa quý hiếm, mỗi cuốn chứa 8 bài phép mạnh mẽ. Hỏi tổng cộng có bao nhiêu bài phép?", answer: 48, difficulty: 2 },
    { id: 14, story: "Lâu đài hoàng gia được xây dựng với 5 tầng cao ngất, mỗi tầng có 9 căn phòng với cửa sổ nhìn ra vườn. Hỏi tổng cộng có bao nhiêu căn phòng?", answer: 45, difficulty: 2 },
    { id: 15, story: "Trên bầu trời lâu đài có 8 con rồng lửa hung dữ đang bay lượn, mỗi con phun ra 8 quả cầu lửa nóng bỏng. Hỏi tổng cộng có bao nhiêu quả cầu lửa?", answer: 64, difficulty: 2 },
    { id: 16, story: "Xung quanh lâu đài có 4 khu vườn phép thuật xanh tốt, mỗi khu trồng 8 cây phép thuật phát sáng ban đêm. Hỏi tổng cộng có bao nhiêu cây phép thuật?", answer: 32, difficulty: 2 },
    { id: 17, story: "Vương quốc có 9 pháo đài vững chắc bảo vệ biên giới, mỗi pháo đài bố trí 9 lính gác cảnh giới. Hỏi tổng cộng có bao nhiêu lính gác?", answer: 81, difficulty: 2 },
    { id: 18, story: "Dọc hành lang lâu đài có 6 bức tượng hiệp sĩ bằng đá cẩm thạch, mỗi bức tượng đeo 9 viên ngọc quý trên áo giáp. Hỏi tổng cộng có bao nhiêu viên ngọc?", answer: 54, difficulty: 2 },
    { id: 19, story: "Hội đồng phù thủy gồm 7 phù thủy quyền năng cao cường, mỗi phù thủy sở hữu 8 cây đũa phép khác nhau. Hỏi tổng cộng có bao nhiêu cây đũa phép?", answer: 56, difficulty: 2 },
    { id: 20, story: "Để bảo vệ lâu đài, người ta đã thiết lập 5 lớp phòng thủ kiên cố, mỗi lớp đặt 9 cái bẫy tinh vi. Hỏi tổng cộng có bao nhiêu cái bẫy?", answer: 45, difficulty: 2 },
    { id: 21, story: "Trên khắp vương quốc có 8 lâu đài nhỏ trực thuộc hoàng gia, mỗi lâu đài ẩn giấu 9 căn phòng bí mật. Hỏi tổng cộng có bao nhiêu phòng bí mật?", answer: 72, difficulty: 3 },
    { id: 22, story: "Liên minh gồm 9 vương quốc hùng mạnh cùng nhau chống lại phù thủy, mỗi vương quốc cử 8 hiệp sĩ tinh nhuệ. Hỏi tổng cộng có bao nhiêu hiệp sĩ?", answer: 72, difficulty: 3 },
    { id: 23, story: "Quanh lâu đài có 7 bức tường thành kiên cố bảo vệ, mỗi bức tường được xây bằng 9 viên gạch phép thuật đặc biệt. Hỏi tổng cộng cần bao nhiêu viên gạch phép?", answer: 63, difficulty: 3 },
    { id: 24, story: "Từ bóng tối xuất hiện 8 con quỷ hung ác đến tấn công lâu đài, mỗi con sử dụng 8 chiêu thức tấn công. Hỏi tổng cộng có bao nhiêu chiêu thức?", answer: 64, difficulty: 3 },
    { id: 25, story: "Được tin Hiệp sĩ đến giải cứu, 9 nàng tiên từ khu rừng thần tiên bay đến giúp sức, mỗi nàng ban 9 phép lành. Hỏi tổng cộng có bao nhiêu phép lành?", answer: 81, difficulty: 3 },
    { id: 26, story: "Trong vương quốc phép thuật có 6 ngọn tháp cao chót vót, mỗi tháp được xây 8 tầng với kiến trúc tuyệt đẹp. Hỏi tổng cộng có bao nhiêu tầng tháp?", answer: 48, difficulty: 2 },
    { id: 27, story: "Nhà vua đã thành lập 8 đội cận vệ trung thành để bảo vệ hoàng gia, mỗi đội gồm 9 thành viên. Hỏi tổng cộng có bao nhiêu cận vệ?", answer: 72, difficulty: 3 },
    { id: 28, story: "Trong vùng núi phía sau lâu đài có 9 hang rồng bí ẩn, bên trong mỗi hang có 8 quả trứng rồng đang ấp. Hỏi tổng cộng có bao nhiêu quả trứng rồng?", answer: 72, difficulty: 3 },
    { id: 29, story: "Trong ngày lễ hội, 7 Hoàng tử từ các vương quốc láng giềng đến chúc mừng, mỗi Hoàng tử tặng 9 bông hồng quý. Hỏi tổng cộng có bao nhiêu bông hồng?", answer: 63, difficulty: 3 },
    { id: 30, story: "Phù thủy đã đặt 8 lời nguyền lên lâu đài, để phá giải mỗi lời nguyền cần thu thập 8 loại nguyên liệu hiếm. Hỏi tổng cộng cần bao nhiêu loại nguyên liệu?", answer: 64, difficulty: 3 },
    { id: 31, story: "Trước cổng lâu đài có 3 đài phun nước trang trí rất đẹp mắt, mỗi đài phun ra 8 tia nước lấp lánh dưới ánh nắng. Hỏi tổng cộng có bao nhiêu tia nước?", answer: 24, difficulty: 1 },
    { id: 32, story: "Trong phòng kho báu hoàng gia trưng bày 4 chiếc vương miện quý giá, mỗi vương miện được đính 9 viên kim cương. Hỏi tổng cộng có bao nhiêu viên kim cương?", answer: 36, difficulty: 2 },
    { id: 33, story: "Lâu đài có 8 khung cửa sổ lớn hướng ra vườn hoa, mỗi cửa sổ được lắp 9 ô kính màu tạo nên bức tranh tuyệt đẹp. Hỏi tổng cộng có bao nhiêu ô kính?", answer: 72, difficulty: 3 },
    { id: 34, story: "Trong thư viện hoàng gia cất giữ 5 cuộn giấy phép thuật cổ đại, mỗi cuộn ghi chép 8 câu thần chú bí ẩn. Hỏi tổng cộng có bao nhiêu câu thần chú?", answer: 40, difficulty: 2 },
    { id: 35, story: "Từ bóng đêm xuất hiện 9 chiến binh bóng tối đến thách đấu Hiệp sĩ, mỗi chiến binh có 8 điểm sức mạnh. Hỏi tổng cộng có bao nhiêu điểm sức mạnh?", answer: 72, difficulty: 3 },
    { id: 36, story: "Dưới lâu đài có 4 hầm ngục tối tăm, mỗi hầm giam giữ 9 người dân vô tội cần được giải cứu. Hỏi tổng cộng có bao nhiêu người cần giải cứu?", answer: 36, difficulty: 2 },
    { id: 37, story: "Trên tường lâu đài treo 6 chiếc gương thần kỳ bí, mỗi gương có thể phản chiếu 8 hình ảnh khác nhau. Hỏi tổng cộng có bao nhiêu hình ảnh?", answer: 48, difficulty: 2 },
    { id: 38, story: "Thư viện phép thuật có 8 kệ sách cao đến trần nhà, mỗi kệ xếp 9 cuốn bí kíp võ công cổ xưa. Hỏi tổng cộng có bao nhiêu cuốn bí kíp?", answer: 72, difficulty: 3 },
    { id: 39, story: "Công chúa tặng Hiệp sĩ 3 chiếc vòng phép thuật bảo vệ, mỗi vòng được gắn 9 viên đá quý phát sáng. Hỏi tổng cộng có bao nhiêu viên đá quý?", answer: 27, difficulty: 1 },
    { id: 40, story: "Trường phép thuật của vương quốc có 9 đội phù thủy được đào tạo bài bản, mỗi đội gồm 9 thành viên. Hỏi tổng cộng có bao nhiêu phù thủy trong trường?", answer: 81, difficulty: 3 },
    { id: 41, story: "Trong chuồng ngựa hoàng gia có 5 con ngựa bay trắng muốt, mỗi con có thể bay qua 8 đám mây trên trời. Hỏi tổng cộng bay qua bao nhiêu đám mây?", answer: 40, difficulty: 2 },
    { id: 42, story: "Trên 7 ngọn tháp canh của lâu đài, mỗi tháp được treo 8 lá cờ vương quốc bay phấp phới. Hỏi tổng cộng có bao nhiêu lá cờ?", answer: 56, difficulty: 2 },
    { id: 43, story: "Nhà vua tổ chức 2 bữa tiệc hoàng gia linh đình để mừng chiến thắng, mỗi bữa tiệc bày 9 món ăn ngon tuyệt. Hỏi tổng cộng có bao nhiêu món ăn?", answer: 18, difficulty: 1 },
    { id: 44, story: "Trong khu rừng phép thuật có 8 con kỳ lân huyền bí đang sinh sống, mỗi con sở hữu 9 loại sức mạnh phép thuật. Hỏi tổng cộng có bao nhiêu loại sức mạnh?", answer: 72, difficulty: 3 },
    { id: 45, story: "Con đường vào lâu đài phải đi qua 6 cánh cổng lớn bằng vàng, mỗi cổng đòi hỏi 9 đồng xu vàng để mở. Hỏi tổng cộng cần bao nhiêu đồng xu vàng?", answer: 54, difficulty: 2 },
    { id: 46, story: "Trong phòng trò chơi hoàng gia có 9 bàn cờ phép thuật tuyệt đẹp, mỗi bàn có 8 quân cờ biết di chuyển. Hỏi tổng cộng có bao nhiêu quân cờ?", answer: 72, difficulty: 3 },
    { id: 47, story: "Trên sông hoàng gia có 4 chiếc thuyền rồng sang trọng đang neo đậu, mỗi thuyền có 8 mái chèo bằng vàng. Hỏi tổng cộng có bao nhiêu mái chèo?", answer: 32, difficulty: 2 },
    { id: 48, story: "Trận chiến cuối cùng đã đến! Phù thủy thả ra 8 con rồng hung dữ nhất, mỗi con sử dụng 9 chiêu tấn công. Hỏi tổng cộng có bao nhiêu chiêu tấn công?", answer: 72, difficulty: 3 },
    { id: 49, story: "Sau khi chiến thắng, Hiệp sĩ khám phá 9 ngôi đền cổ xưa ẩn giấu trong lâu đài, mỗi đền cất giữ 9 bảo vật quý giá. Hỏi tổng cộng có bao nhiêu bảo vật?", answer: 81, difficulty: 3 },
    { id: 50, story: "Vương quốc đã được giải phóng! Hiệp sĩ đã giúp 8 vương quốc thoát khỏi lời nguyền, mỗi vương quốc gồm 8 thành phố. Hỏi tổng cộng đã giải phóng bao nhiêu thành phố?", answer: 64, difficulty: 3 },
];

// ── CHỦ ĐỀ SỐ / CUSTOM (hỗn hợp bảng nhân 2-9) ──
const CUSTOM_QUESTIONS: Question[] = [
    { id: 1, story: "Hiệp sĩ ơi! Trên bàn có 2 hộp kẹo xinh xắn, bên trong mỗi hộp chứa 5 viên kẹo ngọt. Hỏi tổng cộng có bao nhiêu viên kẹo?", answer: 10, difficulty: 1 },
    { id: 2, story: "Trong lớp học có 3 bạn nhỏ ngoan ngoãn ngồi học bài, mỗi bạn mang theo 3 quyển vở mới. Hỏi tổng cộng có bao nhiêu quyển vở?", answer: 9, difficulty: 1 },
    { id: 3, story: "Ngoài sân đỗ 4 chiếc xe tải đang chờ giao hàng, mỗi xe chở 2 thùng hàng nặng. Hỏi tổng cộng có bao nhiêu thùng hàng?", answer: 8, difficulty: 1 },
    { id: 4, story: "Nhà Hiệp sĩ nuôi 2 chú mèo dễ thương rất giỏi bắt chuột, mỗi chú bắt được 4 con chuột. Hỏi tổng cộng hai chú mèo bắt được bao nhiêu con chuột?", answer: 8, difficulty: 1 },
    { id: 5, story: "Bà nấu cơm cho cả nhà với 3 nồi canh ngon lành, mỗi nồi múc ra được 4 bát canh. Hỏi tổng cộng có bao nhiêu bát canh?", answer: 12, difficulty: 1 },
    { id: 6, story: "Trong rạp hát có 5 hàng ghế xếp ngay ngắn cho khán giả, mỗi hàng bày 3 cái ghế. Hỏi tổng cộng rạp hát có bao nhiêu cái ghế?", answer: 15, difficulty: 1 },
    { id: 7, story: "Phòng ăn của trường có 4 cái bàn lớn cho học sinh ngồi ăn trưa, mỗi bàn kê 4 cái ghế. Hỏi tổng cộng có bao nhiêu cái ghế?", answer: 16, difficulty: 1 },
    { id: 8, story: "Trường tiểu học mới khai giảng có 2 lớp học đông vui, mỗi lớp có 6 bạn nhỏ đang ngồi học. Hỏi tổng cộng có bao nhiêu bạn?", answer: 12, difficulty: 1 },
    { id: 9, story: "Trên con phố có 3 dãy nhà mới xây đẹp đẽ, mỗi dãy gồm 5 căn nhà liền kề. Hỏi tổng cộng có bao nhiêu căn nhà?", answer: 15, difficulty: 1 },
    { id: 10, story: "Bác nông dân nuôi 6 con gà mái trong chuồng, sáng nay mỗi con đẻ được 2 quả trứng. Hỏi tổng cộng bác nông dân thu được bao nhiêu quả trứng?", answer: 12, difficulty: 1 },
    { id: 11, story: "Cửa hàng đồ chơi bày bán 5 túi bi màu sắc rực rỡ, mỗi túi đựng 5 viên bi tròn. Hỏi tổng cộng cửa hàng có bao nhiêu viên bi?", answer: 25, difficulty: 2 },
    { id: 12, story: "Trên con phố có 4 cửa hàng tạp hóa bán đồ dùng học tập, mỗi cửa hàng trưng bày 7 sản phẩm mới. Hỏi tổng cộng có bao nhiêu sản phẩm?", answer: 28, difficulty: 2 },
    { id: 13, story: "Bến xe buýt có 6 chiếc xe buýt đang chờ đón khách lên xe, mỗi xe chở 6 hành khách ngồi đầy. Hỏi tổng cộng có bao nhiêu hành khách?", answer: 36, difficulty: 2 },
    { id: 14, story: "Trong vườn nhà ông ngoại có 7 cây cam sai trĩu quả đang chín vàng, mỗi cây cho 4 quả cam ngọt. Hỏi tổng cộng có bao nhiêu quả cam?", answer: 28, difficulty: 2 },
    { id: 15, story: "Công viên thủy sinh có 5 bể cá cảnh rất đẹp mắt, mỗi bể nuôi 6 chú cá đủ màu sắc. Hỏi tổng cộng có bao nhiêu chú cá?", answer: 30, difficulty: 2 },
    { id: 16, story: "Trong bữa tiệc sinh nhật bày 8 cái bàn tròn trang trí vui mắt, mỗi bàn đặt 3 đĩa bánh ngọt. Hỏi tổng cộng có bao nhiêu đĩa bánh?", answer: 24, difficulty: 2 },
    { id: 17, story: "Tòa nhà chung cư cao có 6 tầng dành cho cư dân sinh sống, mỗi tầng có 5 căn hộ ấm cúng. Hỏi tổng cộng tòa nhà có bao nhiêu căn hộ?", answer: 30, difficulty: 2 },
    { id: 18, story: "Giải bóng đá trường học có 7 đội bóng tham gia tranh tài, mỗi đội gồm 5 cầu thủ ra sân. Hỏi tổng cộng có bao nhiêu cầu thủ?", answer: 35, difficulty: 2 },
    { id: 19, story: "Quanh khu phố có 4 vườn hoa được chăm sóc cẩn thận, mỗi vườn chia thành 8 luống hoa nhiều màu sắc. Hỏi tổng cộng có bao nhiêu luống hoa?", answer: 32, difficulty: 2 },
    { id: 20, story: "Cô giáo phát cho lớp 9 hộp bút chì màu để vẽ tranh, mỗi hộp chứa 3 cây bút chì. Hỏi tổng cộng cô giáo phát bao nhiêu cây bút chì?", answer: 27, difficulty: 2 },
    { id: 21, story: "Trường tiểu học có 8 lớp học đông vui, mỗi lớp có 5 bạn nam giỏi toán. Hỏi tổng cộng trường có bao nhiêu bạn nam giỏi toán?", answer: 40, difficulty: 2 },
    { id: 22, story: "Thư viện trường xếp 5 kệ sách mới cho học sinh mượn đọc, mỗi kệ bày 7 cuốn sách hay. Hỏi tổng cộng thư viện có bao nhiêu cuốn sách mới?", answer: 35, difficulty: 2 },
    { id: 23, story: "Ngày sinh nhật, Hiệp sĩ nhận được 6 hộp quà bất ngờ từ bạn bè, mỗi hộp chứa 8 món quà xinh xắn. Hỏi tổng cộng Hiệp sĩ nhận được bao nhiêu món quà?", answer: 48, difficulty: 2 },
    { id: 24, story: "Trên bàn trưng bày 7 bình hoa tươi thắm trang trí cho buổi lễ, mỗi bình cắm 6 bông hoa tươi. Hỏi tổng cộng có bao nhiêu bông hoa?", answer: 42, difficulty: 2 },
    { id: 25, story: "Trong thành phố có 3 tòa nhà văn phòng cao tầng hiện đại, mỗi tòa xây 9 tầng rộng rãi. Hỏi tổng cộng có bao nhiêu tầng lầu?", answer: 27, difficulty: 2 },
    { id: 26, story: "Sở cứu hỏa thành phố có 8 đội cứu hỏa luôn sẵn sàng ứng cứu, mỗi đội gồm 6 lính cứu hỏa dũng cảm. Hỏi tổng cộng có bao nhiêu lính cứu hỏa?", answer: 48, difficulty: 3 },
    { id: 27, story: "Nhà ga xe lửa có 9 chuyến xe khởi hành mỗi ngày, mỗi chuyến chở 7 hành khách ngồi đầy toa. Hỏi tổng cộng nhà ga phục vụ bao nhiêu hành khách?", answer: 63, difficulty: 3 },
    { id: 28, story: "Khu thể thao có 7 sân bóng đá rộng rãi cho các đội tập luyện, mỗi sân có 8 cầu thủ đang tập. Hỏi tổng cộng có bao nhiêu cầu thủ?", answer: 56, difficulty: 3 },
    { id: 29, story: "Trường tổ chức kỳ thi học kỳ với 8 phòng thi yên tĩnh, mỗi phòng có 9 bạn học sinh ngồi làm bài. Hỏi tổng cộng có bao nhiêu bạn đi thi?", answer: 72, difficulty: 3 },
    { id: 30, story: "Câu lạc bộ cờ vua có 9 bàn cờ đang diễn ra các trận đấu hấp dẫn, mỗi bàn xếp 8 quân cờ trên bàn. Hỏi tổng cộng có bao nhiêu quân cờ?", answer: 72, difficulty: 3 },
    { id: 31, story: "Trung tâm âm nhạc mở 6 lớp dạy nhạc cho trẻ em vào cuối tuần, mỗi lớp có 7 học viên nhí. Hỏi tổng cộng có bao nhiêu học viên?", answer: 42, difficulty: 3 },
    { id: 32, story: "Khu công nghiệp có 7 nhà kho lớn chứa hàng hóa xuất khẩu, mỗi kho xếp 9 thùng hàng nặng. Hỏi tổng cộng có bao nhiêu thùng hàng?", answer: 63, difficulty: 3 },
    { id: 33, story: "Trên con sông lớn bắc 8 cây cầu vững chắc nối hai bờ, mỗi cầu được dựng bởi 8 cột trụ bê tông. Hỏi tổng cộng có bao nhiêu cột cầu?", answer: 64, difficulty: 3 },
    { id: 34, story: "Trường nghệ thuật mở 9 lớp vẽ sáng tạo cho thiếu nhi, mỗi lớp trưng bày 9 bức tranh đẹp nhất. Hỏi tổng cộng có bao nhiêu bức tranh?", answer: 81, difficulty: 3 },
    { id: 35, story: "Trong khu vui chơi có 5 rạp chiếu phim hiện đại phục vụ khán giả, mỗi rạp chiếu 8 suất phim mỗi ngày. Hỏi tổng cộng có bao nhiêu suất chiếu?", answer: 40, difficulty: 2 },
    { id: 36, story: "Trên phố bánh có 4 tiệm bánh nổi tiếng thơm phức mùi bánh mới ra lò, mỗi tiệm bán 9 loại bánh khác nhau. Hỏi tổng cộng có bao nhiêu loại bánh?", answer: 36, difficulty: 2 },
    { id: 37, story: "Bảo tàng thành phố có 6 phòng trưng bày nghệ thuật rộng rãi, mỗi phòng đặt 6 bức tượng cổ quý giá. Hỏi tổng cộng bảo tàng có bao nhiêu bức tượng?", answer: 36, difficulty: 2 },
    { id: 38, story: "Ga tàu hỏa có 3 chuyến tàu khởi hành vào buổi sáng sớm, mỗi chuyến gồm 8 toa tàu nối dài. Hỏi tổng cộng có bao nhiêu toa tàu?", answer: 24, difficulty: 2 },
    { id: 39, story: "Thành phố có 7 vườn bách thú lớn cho du khách tham quan, mỗi vườn nuôi 7 loài thú quý hiếm. Hỏi tổng cộng có bao nhiêu loài thú?", answer: 49, difficulty: 3 },
    { id: 40, story: "Hệ thống thư viện gồm 8 thư viện phục vụ bạn đọc trên toàn thành phố, mỗi thư viện có 7 kệ sách lớn. Hỏi tổng cộng có bao nhiêu kệ sách?", answer: 56, difficulty: 3 },
    { id: 41, story: "Gần nhà Hiệp sĩ có 2 siêu thị lớn bán đủ mọi thứ, mỗi siêu thị có 9 quầy thu ngân phục vụ khách. Hỏi tổng cộng có bao nhiêu quầy thu ngân?", answer: 18, difficulty: 1 },
    { id: 42, story: "Công ty đường sắt vận hành 9 đoàn tàu chạy khắp cả nước mỗi ngày, mỗi đoàn gồm 6 toa tàu. Hỏi tổng cộng có bao nhiêu toa tàu?", answer: 54, difficulty: 3 },
    { id: 43, story: "Thành phố xây dựng 4 công viên xanh mát cho người dân vui chơi, mỗi công viên có 6 khu vui chơi dành cho trẻ em. Hỏi tổng cộng có bao nhiêu khu vui chơi?", answer: 24, difficulty: 2 },
    { id: 44, story: "Trung tâm thể thao mở 5 lớp dạy bơi cho trẻ em vào hè, mỗi lớp có 4 bạn nhỏ đang học bơi. Hỏi tổng cộng có bao nhiêu bạn học bơi?", answer: 20, difficulty: 1 },
    { id: 45, story: "Vùng ngoại ô có 6 trang trại chăn nuôi rộng lớn, mỗi trang trại nuôi 9 con bò sữa khỏe mạnh. Hỏi tổng cộng có bao nhiêu con bò sữa?", answer: 54, difficulty: 3 },
    { id: 46, story: "Trong năm học này, Hiệp sĩ phải trải qua 7 lần kiểm tra toán, mỗi lần gồm 7 câu hỏi cần trả lời. Hỏi tổng cộng có bao nhiêu câu hỏi?", answer: 49, difficulty: 3 },
    { id: 47, story: "Lễ hội mùa hè kéo dài 8 ngày vui tưng bừng, mỗi ngày tổ chức 8 trò chơi thú vị cho mọi người. Hỏi tổng cộng lễ hội có bao nhiêu trò chơi?", answer: 64, difficulty: 3 },
    { id: 48, story: "Mỗi ngày gia đình Hiệp sĩ ăn 3 bữa cơm đầm ấm, mỗi bữa bà nấu 7 món ăn ngon lành. Hỏi tổng cộng mỗi ngày gia đình ăn bao nhiêu món?", answer: 21, difficulty: 2 },
    { id: 49, story: "Cuộc thi toán học trường có 9 đội thi đua tài sôi nổi, mỗi đội gồm 9 thành viên xuất sắc. Hỏi tổng cộng có bao nhiêu thành viên tham gia?", answer: 81, difficulty: 3 },
    { id: 50, story: "Vòng chung kết đã đến! Giải đấu có 8 đội bóng mạnh nhất tranh tài, mỗi đội gồm 8 cầu thủ ra sân thi đấu. Hỏi tổng cộng có bao nhiêu cầu thủ?", answer: 64, difficulty: 3 },
];

// ── Map chủ đề → bộ câu hỏi ──
const QUESTION_BANKS: Record<string, Question[]> = {
    'forest': FOREST_QUESTIONS,
    'space': SPACE_QUESTIONS,
    'castle': CASTLE_QUESTIONS,
    'custom': CUSTOM_QUESTIONS,
};

/**
 * Lấy bộ câu hỏi ngẫu nhiên theo chủ đề, sắp xếp từ dễ → khó
 */
export function getRandomQuestions(topicId: string, count: number): Question[] {
    const bank = QUESTION_BANKS[topicId] || QUESTION_BANKS['custom'];

    // Tách theo độ khó
    const easy = bank.filter(q => q.difficulty === 1);
    const medium = bank.filter(q => q.difficulty === 2);
    const hard = bank.filter(q => q.difficulty === 3);

    // Shuffle mỗi nhóm
    const shuffle = (arr: Question[]) => [...arr].sort(() => Math.random() - 0.5);

    // Set CHUNG cho tất cả nhóm — đáp án đã dùng sẽ không lặp
    const usedAnswers = new Set<number>();

    // Chọn câu ưu tiên đáp án khác nhau (dùng chung usedAnswers)
    const pickUnique = (pool: Question[], needed: number): Question[] => {
        const shuffled = shuffle(pool);
        const picked: Question[] = [];

        // Vòng 1: chọn câu có đáp án chưa dùng (kể cả ở nhóm khác)
        for (const q of shuffled) {
            if (picked.length >= needed) break;
            if (!usedAnswers.has(q.answer)) {
                picked.push(q);
                usedAnswers.add(q.answer);
            }
        }

        // Vòng 2: nếu chưa đủ, cho phép trùng nhưng ưu tiên đáp án ít trùng nhất
        if (picked.length < needed) {
            for (const q of shuffled) {
                if (picked.length >= needed) break;
                if (!picked.includes(q)) {
                    picked.push(q);
                    usedAnswers.add(q.answer);
                }
            }
        }

        return picked;
    };

    // Phân bổ: 30% dễ, 40% TB, 30% khó
    const easyCount = Math.max(1, Math.round(count * 0.3));
    const hardCount = Math.max(1, Math.round(count * 0.3));
    const mediumCount = count - easyCount - hardCount;

    // Chọn theo thứ tự: easy → medium → hard (usedAnswers tích lũy)
    const selected = [
        ...pickUnique(easy, easyCount),
        ...pickUnique(medium, mediumCount),
        ...pickUnique(hard, hardCount),
    ];

    // Sắp xếp: dễ → TB → khó, cùng difficulty thì đáp án nhỏ trước
    return selected.sort((a, b) => a.difficulty - b.difficulty || a.answer - b.answer);
}

/**
 * Kiểm tra đáp án - client-side, không cần API
 */
export function checkAnswer(userAnswer: string, correctAnswer: number): boolean {
    const cleaned = userAnswer.trim().toLowerCase();
    // Thử parse số trực tiếp
    const num = parseInt(cleaned.replace(/[^\d]/g, ''), 10);
    if (!isNaN(num) && num === correctAnswer) return true;

    // Kiểm tra chữ số tiếng Việt
    const vnNumbers: Record<string, number> = {
        'không': 0, 'một': 1, 'hai': 2, 'ba': 3, 'bốn': 4, 'năm': 5,
        'sáu': 6, 'bảy': 7, 'tám': 8, 'chín': 9, 'mười': 10,
        'mười một': 11, 'mười hai': 12, 'mười ba': 13, 'mười bốn': 14,
        'mười lăm': 15, 'mười sáu': 16, 'mười bảy': 17, 'mười tám': 18,
        'mười chín': 19, 'hai mươi': 20, 'hai mốt': 21,
        'hai hai': 22, 'hai ba': 23, 'hai bốn': 24, 'hai lăm': 25,
        'hai sáu': 26, 'hai bảy': 27, 'hai tám': 28, 'hai chín': 29,
        'ba mươi': 30, 'ba mốt': 31, 'ba hai': 32, 'ba ba': 33,
        'ba bốn': 34, 'ba lăm': 35, 'ba sáu': 36, 'ba bảy': 37,
        'ba tám': 38, 'ba chín': 39, 'bốn mươi': 40, 'bốn mốt': 41,
        'bốn hai': 42, 'bốn ba': 43, 'bốn bốn': 44, 'bốn lăm': 45,
        'bốn sáu': 46, 'bốn bảy': 47, 'bốn tám': 48, 'bốn chín': 49,
        'năm mươi': 50, 'năm mốt': 51, 'năm hai': 52, 'năm ba': 53,
        'năm bốn': 54, 'năm lăm': 55, 'năm sáu': 56, 'năm bảy': 57,
        'năm tám': 58, 'năm chín': 59, 'sáu mươi': 60, 'sáu mốt': 61,
        'sáu hai': 62, 'sáu ba': 63, 'sáu bốn': 64, 'sáu lăm': 65,
        'bảy mươi': 70, 'bảy hai': 72, 'tám mươi': 80, 'tám mốt': 81,
    };

    for (const [word, value] of Object.entries(vnNumbers)) {
        if (cleaned.includes(word) && value === correctAnswer) return true;
    }

    return false;
}
