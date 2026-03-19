// Bộ câu hỏi offline - bốc ngẫu nhiên, không cần gọi API
// Mỗi chủ đề 50 câu, từ dễ → khó

export interface Question {
    id: number;
    story: string;      // Câu chuyện + câu hỏi
    answer: number;      // Đáp án đúng
    difficulty: 1 | 2 | 3; // 1=dễ, 2=TB, 3=khó
}

// ── RỪNG XANH KỲ BÍ (bảng nhân 2, 3, 4) ──
const FOREST_QUESTIONS: Question[] = [
    { id: 1, story: "Hiệp sĩ ơi! Trong khu rừng xanh có 2 chú thỏ đang ngồi ăn cà rốt, mỗi chú ôm 2 củ cà rốt. Hỏi có tất cả bao nhiêu củ cà rốt?", answer: 4, difficulty: 1 },
    { id: 2, story: "Hiệp sĩ ơi! Trên những cành cây cao có 2 tổ chim xinh xắn, mỗi tổ có 3 chú chim non. Hỏi có tất cả bao nhiêu chú chim?", answer: 6, difficulty: 1 },
    { id: 3, story: "Bên bờ suối có 3 bụi hoa dại đang nở rộ, mỗi bụi có 2 bông hoa. Hỏi tổng cộng có bao nhiêu bông hoa?", answer: 6, difficulty: 1 },
    { id: 4, story: "Chú Sóc nâu chăm chỉ đã hái được 2 giỏ hạt dẻ mang về nhà, mỗi giỏ chứa 4 hạt dẻ. Hỏi chú Sóc có tất cả bao nhiêu hạt dẻ?", answer: 8, difficulty: 1 },
    { id: 5, story: "Hiệp sĩ nhìn thấy 3 chú nai đang tha thẩn trong rừng, mỗi chú mang theo 3 quả táo rừng. Hỏi tổng cộng có bao nhiêu quả táo?", answer: 9, difficulty: 1 },
    { id: 6, story: "Trên cánh đồng hoa có 4 chú bướm xinh đẹp đang bay lượn, mỗi chú đậu trên 2 bông hoa. Hỏi có bao nhiêu bông hoa có bướm đậu?", answer: 8, difficulty: 1 },
    { id: 7, story: "Trong khu rừng có 2 cây cổ thụ thật to, trên mỗi cây có 3 tổ ong mật. Hỏi tổng cộng có bao nhiêu tổ ong?", answer: 6, difficulty: 1 },
    { id: 8, story: "Hiệp sĩ phát hiện 4 đàn kiến đang hành quân qua đường, mỗi đàn có 2 con kiến lính dẫn đầu. Hỏi tổng cộng có bao nhiêu kiến lính?", answer: 8, difficulty: 1 },
    { id: 9, story: "Có 3 chú hươu cao cổ đang thong thả ăn lá cây bên hồ nước, mỗi chú ăn hết 4 chiếc lá. Hỏi tổng cộng các chú hươu ăn bao nhiêu chiếc lá?", answer: 12, difficulty: 1 },
    { id: 10, story: "Dọc theo con đường mòn có 4 hang thỏ ấm áp, mỗi hang có 3 chú thỏ con đang nằm ngủ. Hỏi có tất cả bao nhiêu chú thỏ con?", answer: 12, difficulty: 1 },
    { id: 11, story: "Hiệp sĩ đang đi trong rừng thì gặp 3 đàn bướm bay ngang qua, mỗi đàn có 4 con bướm rực rỡ. Hỏi tổng cộng Hiệp sĩ thấy bao nhiêu con bướm?", answer: 12, difficulty: 2 },
    { id: 12, story: "Trong khu rừng cổ có 4 cây cổ thụ cao vút, trên mỗi cây có 4 tổ chim được xây rất đẹp. Hỏi tổng cộng có bao nhiêu tổ chim?", answer: 16, difficulty: 2 },
    { id: 13, story: "Chú Khỉ con tinh nghịch đã hái được 3 cành chuối từ trên cây xuống, mỗi cành có 3 nải chuối chín. Hỏi chú Khỉ có bao nhiêu nải chuối?", answer: 9, difficulty: 2 },
    { id: 14, story: "Hiệp sĩ thấy 4 chú voi to lớn đang lội qua con suối, mỗi chú mang trên lưng 3 khúc gỗ để xây cầu. Hỏi tổng cộng có bao nhiêu khúc gỗ?", answer: 12, difficulty: 2 },
    { id: 15, story: "Trong một hang động bí mật, Hiệp sĩ tìm thấy 2 kho báu lấp lánh, mỗi kho có 4 hòm vàng. Hỏi có bao nhiêu hòm vàng tất cả?", answer: 8, difficulty: 2 },
    { id: 16, story: "Ven hồ nước trong xanh có 3 đầm sen tuyệt đẹp, mỗi đầm có 4 bông sen đang nở. Hỏi tổng cộng có bao nhiêu bông sen?", answer: 12, difficulty: 2 },
    { id: 17, story: "Bên dòng suối có 4 chú gấu đang kiên nhẫn bắt cá, mỗi chú bắt được 4 con cá. Hỏi tổng cộng các chú gấu bắt được bao nhiêu con cá?", answer: 16, difficulty: 2 },
    { id: 18, story: "Trong khu rừng thần tiên có 3 dòng suối chảy qua, dưới mỗi dòng suối ẩn giấu 3 hòn đá quý. Hỏi tổng cộng có bao nhiêu hòn đá quý?", answer: 9, difficulty: 2 },
    { id: 19, story: "Hiệp sĩ nhìn thấy 2 đàn voi đang dạo chơi trong rừng, mỗi đàn có 4 chú voi con dễ thương. Hỏi có tất cả bao nhiêu chú voi con?", answer: 8, difficulty: 2 },
    { id: 20, story: "Khu rừng rộng lớn được chia thành 4 cánh rừng nhỏ, mỗi cánh rừng có 3 chú hổ đang canh gác. Hỏi tổng cộng có bao nhiêu chú hổ?", answer: 12, difficulty: 2 },
    { id: 21, story: "Phía xa có 3 ngọn núi cao sừng sững, bên trong mỗi ngọn núi có 4 hang động bí mật. Hỏi tổng cộng có bao nhiêu hang động?", answer: 12, difficulty: 2 },
    { id: 22, story: "Để bảo vệ rừng xanh, người dân đã lập 4 nhóm kiểm lâm, mỗi nhóm gồm 4 người. Hỏi tổng cộng có bao nhiêu người kiểm lâm?", answer: 16, difficulty: 2 },
    { id: 23, story: "Trong vườn thú rừng có 2 khu vườn xinh đẹp, mỗi khu vườn nuôi 3 chú công đang xòe đuôi múa. Hỏi có tất cả bao nhiêu chú công?", answer: 6, difficulty: 2 },
    { id: 24, story: "Bên dưới 3 ngọn thác nước hùng vĩ, mỗi ngọn thác có 4 chú cá vàng đang bơi lội. Hỏi tổng cộng có bao nhiêu chú cá vàng?", answer: 12, difficulty: 2 },
    { id: 25, story: "Rừng tre xanh mát được chia thành 4 khu, mỗi khu có 2 chú gấu trúc đang nằm ăn tre. Hỏi tổng cộng có bao nhiêu chú gấu trúc?", answer: 8, difficulty: 2 },
    { id: 26, story: "Để đến được lâu đài, Hiệp sĩ phải vượt qua 4 cánh rừng nguy hiểm, mỗi cánh rừng có 4 cái bẫy cần tránh. Hỏi tổng cộng có bao nhiêu cái bẫy?", answer: 16, difficulty: 3 },
    { id: 27, story: "Quanh rừng có 3 ngôi làng nhỏ yên bình, mỗi làng nuôi 4 đàn ong để lấy mật. Hỏi tổng cộng có bao nhiêu đàn ong?", answer: 12, difficulty: 3 },
    { id: 28, story: "Sâu trong rừng có 4 con rồng xanh đang canh giữ kho báu, mỗi con bảo vệ 4 viên ngọc quý. Hỏi tổng cộng có bao nhiêu viên ngọc?", answer: 16, difficulty: 3 },
    { id: 29, story: "Vua rừng xanh đã thành lập 3 đội Hiệp sĩ dũng cảm, mỗi đội gồm 4 chiến binh mang theo kiếm. Hỏi tổng cộng có bao nhiêu thanh kiếm?", answer: 12, difficulty: 3 },
    { id: 30, story: "Giữa rừng có một cây thần kỳ diệu mọc lên 4 cành lớn, mỗi cành mang 4 quả phép thuật lấp lánh. Hỏi cây thần có tổng cộng bao nhiêu quả phép thuật?", answer: 16, difficulty: 3 },
    { id: 31, story: "Trên đỉnh núi cao có 2 chú phượng hoàng lộng lẫy đang làm tổ, mỗi chú đẻ 3 quả trứng vàng óng ánh. Hỏi có tất cả bao nhiêu quả trứng vàng?", answer: 6, difficulty: 1 },
    { id: 32, story: "Trong khu rừng yên tĩnh có 3 hồ nước trong veo, trên mỗi hồ có 2 chú thiên nga trắng muốt đang bơi. Hỏi tổng cộng có bao nhiêu chú thiên nga?", answer: 6, difficulty: 1 },
    { id: 33, story: "Đêm xuống, 4 bầy sói cất tiếng hú vang rừng, mỗi bầy có 3 chú sói con đi theo mẹ. Hỏi tổng cộng có bao nhiêu chú sói con?", answer: 12, difficulty: 2 },
    { id: 34, story: "Ven rừng có 2 cánh đồng hoa rực rỡ sắc màu, mỗi cánh đồng được chia thành 4 luống hoa. Hỏi tổng cộng có bao nhiêu luống hoa?", answer: 8, difficulty: 1 },
    { id: 35, story: "Bên bờ suối có 3 chú rùa già đang phơi nắng, trên mai mỗi chú mang 3 viên đá quý. Hỏi tổng cộng có bao nhiêu viên đá quý?", answer: 9, difficulty: 2 },
    { id: 36, story: "Quanh khu rừng có 4 ngọn đồi xanh mướt, trên mỗi ngọn đồi có 4 chú thỏ đang nhảy nhót. Hỏi tổng cộng có bao nhiêu chú thỏ?", answer: 16, difficulty: 2 },
    { id: 37, story: "Bác nông dân trồng 2 khu vườn trong rừng, mỗi khu vườn có 4 cây ăn quả sai trĩu. Hỏi tổng cộng có bao nhiêu cây ăn quả?", answer: 8, difficulty: 1 },
    { id: 38, story: "Trên cành cây cao có 3 tổ ong mật vàng óng, mỗi tổ có 4 chú ong thợ đang chăm chỉ làm việc. Hỏi tổng cộng có bao nhiêu chú ong thợ?", answer: 12, difficulty: 2 },
    { id: 39, story: "Có 4 chú cáo tinh ranh đang chơi trốn tìm trong rừng, mỗi chú giấu 3 quả trứng ở nơi bí mật. Hỏi tổng cộng có bao nhiêu quả trứng được giấu?", answer: 12, difficulty: 2 },
    { id: 40, story: "Hiệp sĩ vào rừng thu thập nấm và đã hái được 3 rổ nấm đầy, mỗi rổ chứa 4 cây nấm tươi. Hỏi Hiệp sĩ hái được tổng cộng bao nhiêu cây nấm?", answer: 12, difficulty: 2 },
    { id: 41, story: "Trên bầu trời rừng xanh có 4 chú đại bàng đang bay lượn, mỗi chú vừa bắt được 4 con chuột nhỏ. Hỏi tổng cộng các chú đại bàng bắt được bao nhiêu con chuột?", answer: 16, difficulty: 3 },
    { id: 42, story: "Hiệp sĩ đi qua 2 dòng sông lớn chảy qua khu rừng, trên mỗi dòng sông người dân đã bắc 3 cây cầu gỗ. Hỏi tổng cộng có bao nhiêu cây cầu gỗ?", answer: 6, difficulty: 1 },
    { id: 43, story: "Trong rừng tre xanh mát có 3 khu rừng tre riêng biệt, mỗi khu có 4 chú gấu trúc đáng yêu sinh sống. Hỏi tổng cộng có bao nhiêu chú gấu trúc?", answer: 12, difficulty: 2 },
    { id: 44, story: "Ngoài cánh đồng lúa vàng có 4 cánh đồng rộng mênh mông, mỗi cánh đồng người dân dựng 3 bù nhìn rơm để canh lúa. Hỏi tổng cộng có bao nhiêu bù nhìn?", answer: 12, difficulty: 2 },
    { id: 45, story: "Khi đêm xuống, trong rừng có 2 chú đom đóm bay lượn, mỗi chú tỏa ra 4 đốm sáng lấp lánh. Hỏi tổng cộng có bao nhiêu đốm sáng?", answer: 8, difficulty: 1 },
    { id: 46, story: "Sâu trong rừng có 3 hang gấu ấm cúng, bên trong mỗi hang Gấu mẹ cất giữ 4 hũ mật ong thơm lừng. Hỏi tổng cộng có bao nhiêu hũ mật ong?", answer: 12, difficulty: 2 },
    { id: 47, story: "Trên cây dừa cao có 4 chú khỉ đang đu đưa vui vẻ, mỗi chú ôm chặt 3 quả dừa. Hỏi tổng cộng có bao nhiêu quả dừa?", answer: 12, difficulty: 3 },
    { id: 48, story: "Khu rừng phép thuật có 3 cánh cửa bí mật dẫn vào bên trong, mỗi cánh cửa cần đúng 4 chiếc chìa khóa để mở. Hỏi cần tổng cộng bao nhiêu chiếc chìa khóa?", answer: 12, difficulty: 3 },
    { id: 49, story: "Ở cuối rừng có 4 con rồng xanh hùng mạnh đang bảo vệ kho báu, mỗi con canh giữ 4 viên kim cương quý giá. Hỏi tổng cộng có bao nhiêu viên kim cương?", answer: 16, difficulty: 3 },
    { id: 50, story: "Hiệp sĩ đã đến gần cuối hành trình và phải vượt qua một thử thách cuối cùng, mỗi thử thách gồm 4 câu đố hóc búa. Hỏi tổng cộng có bao nhiêu câu đố?", answer: 12, difficulty: 3 },
];

// ── VŨ TRỤ BAO LA (bảng nhân 5, 6, 7) ──
const SPACE_QUESTIONS: Question[] = [
    { id: 1, story: "Hiệp sĩ ơi! Trên hành trình bay qua vũ trụ, Hiệp sĩ đã ghé thăm 2 hành tinh lạ, mỗi hành tinh có 5 con quái vật đang canh giữ. Hỏi tổng cộng có bao nhiêu con quái vật?", answer: 10, difficulty: 1 },
    { id: 2, story: "Ngoài không gian có 2 phi thuyền đang bay về Trái Đất, mỗi phi thuyền chở 6 phi hành gia. Hỏi tổng cộng có bao nhiêu phi hành gia?", answer: 12, difficulty: 1 },
    { id: 3, story: "Trên bầu trời đêm có 3 ngôi sao sáng nhất, quanh mỗi ngôi sao có 5 viên đá vũ trụ bay quanh. Hỏi tổng cộng có bao nhiêu viên đá vũ trụ?", answer: 15, difficulty: 1 },
    { id: 4, story: "Hiệp sĩ phát hiện 2 trạm không gian khổng lồ đang trôi nổi, mỗi trạm có 7 căn phòng cho phi hành gia. Hỏi tổng cộng có bao nhiêu căn phòng?", answer: 14, difficulty: 1 },
    { id: 5, story: "Trong hệ mặt trời có 3 hành tinh xanh tươi đẹp, quanh mỗi hành tinh có 6 vệ tinh bay quanh. Hỏi tổng cộng có bao nhiêu vệ tinh?", answer: 18, difficulty: 1 },
    { id: 6, story: "Tại căn cứ vũ trụ có 5 con robot thông minh được chế tạo để giúp phi hành gia, mỗi con có 2 cánh tay cơ khí. Hỏi tổng cộng có bao nhiêu cánh tay?", answer: 10, difficulty: 1 },
    { id: 7, story: "Kính thiên văn phát hiện 2 thiên hà rực rỡ ngoài vũ trụ xa xôi, mỗi thiên hà có 5 chòm sao lấp lánh. Hỏi tổng cộng có bao nhiêu chòm sao?", answer: 10, difficulty: 1 },
    { id: 8, story: "Đội vận chuyển có 3 tàu vũ trụ đang chở hàng tiếp tế, mỗi tàu chở 7 hộp hàng. Hỏi tổng cộng có bao nhiêu hộp hàng?", answer: 21, difficulty: 1 },
    { id: 9, story: "Hiệp sĩ bay qua 2 mặt trăng kỳ lạ, trên bề mặt mỗi mặt trăng có 6 miệng núi lửa đang ngủ yên. Hỏi tổng cộng có bao nhiêu miệng núi lửa?", answer: 12, difficulty: 1 },
    { id: 10, story: "Trên hành tinh Xanh có 2 nhóm thám hiểm đang tìm kiếm khoáng sản, mỗi nhóm thu được 5 viên đá quý. Hỏi tổng cộng thu được bao nhiêu viên đá quý?", answer: 10, difficulty: 1 },
    { id: 11, story: "Quái vật vũ trụ đã cử 5 đội quân xâm lược đến tấn công, mỗi đội gồm 5 lính chiến. Hỏi tổng cộng có bao nhiêu lính quái vật?", answer: 25, difficulty: 2 },
    { id: 12, story: "Có 6 hành tinh đã bị quái vật chiếm đóng, để giải phóng mỗi hành tinh cần 5 chiến binh. Hỏi tổng cộng cần bao nhiêu chiến binh?", answer: 30, difficulty: 2 },
    { id: 13, story: "Trong vũ trụ có 7 ngôi sao đang tỏa sáng rực rỡ, mỗi ngôi sao chiếu sáng cho 5 hành tinh xung quanh. Hỏi tổng cộng có bao nhiêu hành tinh được chiếu sáng?", answer: 35, difficulty: 2 },
    { id: 14, story: "Đội quân Hiệp sĩ có 5 kho vũ khí bí mật giấu trên các hành tinh, mỗi kho chứa 6 khẩu súng laser. Hỏi tổng cộng có bao nhiêu khẩu súng laser?", answer: 30, difficulty: 2 },
    { id: 15, story: "Để bảo vệ trạm không gian, người ta đã chế tạo 6 robot chiến đấu, mỗi robot được nạp 6 viên năng lượng. Hỏi tổng cộng cần bao nhiêu viên năng lượng?", answer: 36, difficulty: 2 },
    { id: 16, story: "Các nhà khoa học đã khám phá ra 3 thiên hà mới, mỗi thiên hà có 7 hành tinh có thể sinh sống được. Hỏi tổng cộng có bao nhiêu hành tinh có thể sống?", answer: 21, difficulty: 2 },
    { id: 17, story: "Hạm đội vũ trụ gồm 7 phi thuyền chiến đấu sẵn sàng xuất kích, trên mỗi phi thuyền trang bị 5 vũ khí tối tân. Hỏi tổng cộng có bao nhiêu vũ khí?", answer: 35, difficulty: 2 },
    { id: 18, story: "Hệ thống phòng thủ có 5 trạm radar được đặt trên các hành tinh, mỗi trạm phát hiện được 7 vật thể lạ đang tiến đến. Hỏi tổng cộng phát hiện bao nhiêu vật thể lạ?", answer: 35, difficulty: 2 },
    { id: 19, story: "Tổ chức thám hiểm vũ trụ đã cử 6 đội thám hiểm đi khám phá các hành tinh, mỗi đội gồm 7 thành viên. Hỏi tổng cộng có bao nhiêu thành viên thám hiểm?", answer: 42, difficulty: 2 },
    { id: 20, story: "Quanh hành tinh lớn có 7 mặt trăng đang quay quanh, trên mỗi mặt trăng đã xây dựng 6 căn cứ nghiên cứu. Hỏi tổng cộng có bao nhiêu căn cứ vũ trụ?", answer: 42, difficulty: 2 },
    { id: 21, story: "Đô đốc vũ trụ chỉ huy 5 hạm đội hùng mạnh, mỗi hạm đội gồm 7 tàu chiến sẵn sàng ra trận. Hỏi tổng cộng có bao nhiêu tàu chiến?", answer: 35, difficulty: 3 },
    { id: 22, story: "Trùm quái vật có 7 tướng lĩnh hung ác, mỗi tướng lĩnh chỉ huy 7 tay sai trung thành. Hỏi tổng cộng có bao nhiêu tay sai?", answer: 49, difficulty: 3 },
    { id: 23, story: "Trong vũ trụ có 6 cổng dịch chuyển không gian bí ẩn, mỗi cổng dẫn đến 6 chiều không gian khác nhau. Hỏi tổng cộng có bao nhiêu chiều không gian?", answer: 36, difficulty: 3 },
    { id: 24, story: "Hiệp sĩ phải khám phá 5 hành tinh nguy hiểm, trên mỗi hành tinh có 6 khu vực đầy bẫy rập. Hỏi tổng cộng có bao nhiêu khu vực nguy hiểm?", answer: 30, difficulty: 3 },
    { id: 25, story: "Bản đồ vũ trụ ghi nhận 7 hệ sao lớn trong thiên hà, mỗi hệ sao có 5 hành tinh quay quanh. Hỏi tổng cộng có bao nhiêu hành tinh?", answer: 35, difficulty: 3 },
    { id: 26, story: "Thiên hà rộng lớn được chia thành 6 vùng khác nhau, mỗi vùng có 7 ngôi sao tỏa sáng. Hỏi tổng cộng có bao nhiêu ngôi sao?", answer: 42, difficulty: 3 },
    { id: 27, story: "Đội quân Hiệp sĩ có 5 siêu robot chiến đấu cực mạnh, mỗi robot được trang bị 7 loại vũ khí đặc biệt. Hỏi tổng cộng có bao nhiêu loại vũ khí?", answer: 35, difficulty: 3 },
    { id: 28, story: "Trong lịch sử vũ trụ đã xảy ra 7 cuộc chiến lớn giữa các hành tinh, mỗi cuộc chiến gồm 6 trận đánh ác liệt. Hỏi tổng cộng có bao nhiêu trận đánh?", answer: 42, difficulty: 3 },
    { id: 29, story: "Để kích hoạt lá chắn phòng thủ cần 6 loại năng lượng đặc biệt, mỗi loại phải thu thập 5 viên pha lê quý hiếm. Hỏi tổng cộng cần bao nhiêu viên pha lê?", answer: 30, difficulty: 2 },
    { id: 30, story: "Hiệp sĩ đang thu thập 5 bộ sưu tập bản đồ vũ trụ cổ, mỗi bộ gồm 6 mảnh ghép cần tìm kiếm. Hỏi tổng cộng có bao nhiêu mảnh ghép?", answer: 30, difficulty: 2 },
    { id: 31, story: "Kính viễn vọng phát hiện 3 cụm sao mới trong vũ trụ xa xôi, mỗi cụm có 5 hành tinh nhỏ quay quanh. Hỏi tổng cộng có bao nhiêu hành tinh nhỏ?", answer: 15, difficulty: 1 },
    { id: 32, story: "Trên hành tinh Đỏ có 7 bãi đáp dành cho phi thuyền, mỗi bãi đang chứa 5 phi thuyền liên hành tinh. Hỏi tổng cộng có bao nhiêu phi thuyền?", answer: 35, difficulty: 2 },
    { id: 33, story: "Học viện vũ trụ đã cử 5 đoàn thám hiểm đi khám phá các ngôi sao mới, mỗi đoàn có 5 thành viên dũng cảm. Hỏi tổng cộng có bao nhiêu thành viên?", answer: 25, difficulty: 2 },
    { id: 34, story: "Hiệp sĩ tìm thấy 6 kho tàng vũ trụ ẩn giấu trên các tiểu hành tinh, mỗi kho chứa 6 rương vàng lấp lánh. Hỏi tổng cộng có bao nhiêu rương vàng?", answer: 36, difficulty: 2 },
    { id: 35, story: "Trong trận chiến, 7 con quái vật khổng lồ đang tấn công trạm không gian, mỗi con phun ra 7 viên đạn lửa. Hỏi tổng cộng có bao nhiêu viên đạn lửa?", answer: 49, difficulty: 3 },
    { id: 36, story: "Hệ thống phòng thủ của căn cứ gồm 5 lớp bảo vệ vững chắc, mỗi lớp được trang bị 6 tháp canh. Hỏi tổng cộng có bao nhiêu tháp canh?", answer: 30, difficulty: 2 },
    { id: 37, story: "Đội bay có 6 phi công giàu kinh nghiệm, mỗi người đã hoàn thành 5 chuyến bay thám hiểm xa xôi. Hỏi tổng cộng có bao nhiêu chuyến bay?", answer: 30, difficulty: 2 },
    { id: 38, story: "Ẩn sâu trong vũ trụ có 7 căn cứ bí mật của quân kháng chiến, mỗi căn cứ có 6 lối vào được ngụy trang. Hỏi tổng cộng có bao nhiêu lối vào?", answer: 42, difficulty: 3 },
    { id: 39, story: "Để sử dụng 5 vũ khí siêu cấp chống quái vật, mỗi vũ khí cần được nạp 7 viên pin năng lượng mặt trời. Hỏi tổng cộng cần bao nhiêu viên pin?", answer: 35, difficulty: 2 },
    { id: 40, story: "Hiệp sĩ đã hoàn thành 6 nhiệm vụ giải cứu các hành tinh thành công, mỗi nhiệm vụ được thưởng 7 điểm danh dự. Hỏi tổng cộng Hiệp sĩ nhận được bao nhiêu điểm?", answer: 42, difficulty: 2 },
    { id: 41, story: "Con đường đến trạm mẹ phải đi qua 7 tầng không gian khác nhau, mỗi tầng có 5 cánh cửa cần mở. Hỏi tổng cộng có bao nhiêu cánh cửa?", answer: 35, difficulty: 2 },
    { id: 42, story: "Nhà khoa học chế tạo 3 quả cầu năng lượng đặc biệt để cung cấp điện cho trạm, mỗi quả chứa 6 đơn vị năng lượng. Hỏi tổng cộng có bao nhiêu đơn vị năng lượng?", answer: 18, difficulty: 1 },
    { id: 43, story: "Viện nghiên cứu cử 5 nhóm khoa học đi khám phá các hành tinh lạ, mỗi nhóm thu thập được 6 mẫu vật quý giá. Hỏi tổng cộng thu được bao nhiêu mẫu vật?", answer: 30, difficulty: 2 },
    { id: 44, story: "Trên đường bay có 7 cơn bão vũ trụ đang hoành hành dữ dội, mỗi cơn bão kéo dài 5 giờ đồng hồ. Hỏi tổng thời gian các cơn bão kéo dài bao nhiêu giờ?", answer: 35, difficulty: 2 },
    { id: 45, story: "Dọc hành trình bay có 6 trạm tiếp nhiên liệu dành cho phi thuyền, mỗi trạm được trang bị 7 máy bơm hiện đại. Hỏi tổng cộng có bao nhiêu máy bơm?", answer: 42, difficulty: 3 },
    { id: 46, story: "Hiệp sĩ phát hiện 2 thiên thạch khổng lồ đang bay đến gần, mỗi thiên thạch vỡ ra thành 7 mảnh nhỏ. Hỏi tổng cộng có bao nhiêu mảnh thiên thạch?", answer: 14, difficulty: 1 },
    { id: 47, story: "Đội quân ánh sáng gồm 5 chiến binh dũng cảm sẵn sàng chiến đấu, mỗi chiến binh thành thạo 5 chiêu thức đặc biệt. Hỏi tổng cộng có bao nhiêu chiêu thức?", answer: 25, difficulty: 2 },
    { id: 48, story: "Để bảo vệ hành tinh, Hiệp sĩ phải kích hoạt 7 vòng bảo vệ xung quanh, mỗi vòng gồm 7 lá chắn năng lượng. Hỏi tổng cộng có bao nhiêu lá chắn?", answer: 49, difficulty: 3 },
    { id: 49, story: "Tại viện nghiên cứu vũ trụ có 6 nhà khoa học tài ba, mỗi người đã phát minh ra 5 thiết bị công nghệ cao. Hỏi tổng cộng có bao nhiêu thiết bị?", answer: 30, difficulty: 2 },
    { id: 50, story: "Trận chiến cuối cùng đã đến! Quái vật vũ trụ triệu tập 7 đội quân hung ác, mỗi đội gồm 7 chiến binh thiện chiến. Hỏi tổng cộng có bao nhiêu chiến binh quái vật?", answer: 49, difficulty: 3 },
];

// ── LÂU ĐÀI PHÉP THUẬT (bảng nhân 8, 9) ──
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
