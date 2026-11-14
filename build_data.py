# -*- coding: utf-8 -*-
import json

raw_groups = [
    {
        "id": 1,
        "code_prefix": ["1", "2"],
        "name": "Tài khoản tài sản",
        "description": "Phản ánh toàn bộ tài sản ngắn hạn và tài sản dài hạn của doanh nghiệp. Số dư thông thường ở Bên Nợ (trừ các tài khoản điều chỉnh giảm tài sản như 214, 229).",
        "color": "emerald"
    },
    {
        "id": 2,
        "code_prefix": ["3"],
        "name": "Tài khoản nợ phải trả",
        "description": "Phản ánh các nghĩa vụ nợ hiện tại của doanh nghiệp phát sinh từ các giao dịch đã qua. Số dư thông thường ở Bên Có (trừ tài khoản thanh toán lưỡng tính 331).",
        "color": "rose"
    },
    {
        "id": 3,
        "code_prefix": ["4"],
        "name": "Tài khoản vốn chủ sở hữu",
        "description": "Phản ánh nguồn vốn thuộc sở hữu của các nhà đầu tư và các quỹ được hình thành từ kết quả kinh doanh. Số dư thông thường ở Bên Có (trừ 419, 421 khi lỗ).",
        "color": "indigo"
    },
    {
        "id": 4,
        "code_prefix": ["5"],
        "name": "Tài khoản doanh thu",
        "description": "Phản ánh tổng giá trị các lợi ích kinh tế doanh nghiệp thu được trong kỳ kế toán. Không có số dư cuối kỳ, kết chuyển sang TK 911.",
        "color": "amber"
    },
    {
        "id": 5,
        "code_prefix": ["6"],
        "name": "Tài khoản chi phí sản xuất, kinh doanh",
        "description": "Phản ánh toàn bộ các chi phí phát sinh trong quá trình sản xuất kinh doanh thông thường. Không có số dư cuối kỳ (trừ TK 154/62X kết chuyển), kết chuyển sang 154 hoặc 911.",
        "color": "orange"
    },
    {
        "id": 6,
        "code_prefix": ["7"],
        "name": "Tài khoản thu nhập khác",
        "description": "Phản ánh các khoản thu nhập ngoài hoạt động sản xuất kinh doanh thông thường. Không có số dư cuối kỳ, kết chuyển sang TK 911.",
        "color": "teal"
    },
    {
        "id": 7,
        "code_prefix": ["8"],
        "name": "Tài khoản chi phí khác",
        "description": "Phản ánh các khoản chi phí phát sinh ngoài hoạt động sản xuất kinh doanh thông thường và chi phí thuế TNDN. Không có số dư cuối kỳ, kết chuyển sang TK 911.",
        "color": "red"
    },
    {
        "id": 8,
        "code_prefix": ["9"],
        "name": "Tài khoản xác định kết quả kinh doanh",
        "description": "Dùng để tập hợp doanh thu, thu nhập khác và các chi phí nhằm xác định lãi/lỗ của doanh nghiệp trong kỳ kế toán. Không có số dư cuối kỳ.",
        "color": "violet"
    }
]

# Accounts list directly extracted from TT 99/2025/TT-BTC
# Fields: code, name, level, parent_code, group_id, nature, tip
accounts_data = [
    # Nhóm 1: Tài sản
    {"code": "111", "name": "Tiền mặt", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Ba số 1 thẳng tắp như cọc tiền mặt tại quỹ."},
    {"code": "112", "name": "Tiền gửi không kỳ hạn", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Đuôi 2: tiền nằm ở ngân hàng (không kỳ hạn)."},
    {"code": "113", "name": "Tiền đang chuyển", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Đuôi 3: tiền đang 'chạy' giữa quỹ và ngân hàng, chưa vào tài khoản đích."},
    {"code": "121", "name": "Chứng khoán kinh doanh", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Đầu 12 là đầu tư ngắn hạn, 121 mua bán cổ phiếu lướt sóng."},
    {"code": "128", "name": "Đầu tư nắm giữ đến ngày đáo hạn", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Đầu tư giữ chờ ngày đáo hạn thu hồi gốc và lãi."},
    {"code": "1281", "name": "Tiền gửi có kỳ hạn", "level": 2, "parent": "128", "group": 1, "nature": "Dư Nợ", "tip": "Tiền gửi tiết kiệm có kỳ hạn tại ngân hàng."},
    {"code": "1282", "name": "Trái phiếu", "level": 2, "parent": "128", "group": 1, "nature": "Dư Nợ", "tip": "Đầu tư mua trái phiếu giữ đến đáo hạn."},
    {"code": "1283", "name": "Cho vay", "level": 2, "parent": "128", "group": 1, "nature": "Dư Nợ", "tip": "Khoản cho các đơn vị hoặc cá nhân khác vay vốn."},
    {"code": "1288", "name": "Các khoản đầu tư khác nắm giữ đến ngày đáo hạn", "level": 2, "parent": "128", "group": 1, "nature": "Dư Nợ", "tip": "Đuôi 8: các khoản đầu tư giữ đến đáo hạn khác."},
    {"code": "131", "name": "Phải thu của khách hàng", "level": 1, "parent": None, "group": 1, "nature": "Lưỡng tính (thường Dư Nợ)", "tip": "Cặp đôi đối ứng: 131 (phải thu khách) - 331 (phải trả người bán)."},
    {"code": "133", "name": "Thuế GTGT được khấu trừ", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Thuế GTGT đầu vào mua hàng, được nhà nước cho khấu trừ."},
    {"code": "1331", "name": "Thuế GTGT được khấu trừ của hàng hóa, dịch vụ", "level": 2, "parent": "133", "group": 1, "nature": "Dư Nợ", "tip": "Thuế GTGT đầu vào phát sinh khi mua hàng hóa, nguyên vật liệu, dịch vụ."},
    {"code": "1332", "name": "Thuế GTGT được khấu trừ của TSCĐ", "level": 2, "parent": "133", "group": 1, "nature": "Dư Nợ", "tip": "Thuế GTGT đầu vào khi mua sắm tài sản cố định."},
    {"code": "136", "name": "Phải thu nội bộ", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Khoản phải thu giữa công ty mẹ và chi nhánh, đơn vị thành viên."},
    {"code": "1361", "name": "Vốn kinh doanh ở đơn vị trực thuộc", "level": 2, "parent": "136", "group": 1, "nature": "Dư Nợ", "tip": "Phản ánh số vốn cấp cho đơn vị trực thuộc hạch toán phụ thuộc."},
    {"code": "1362", "name": "Phải thu nội bộ về chênh lệch tỷ giá", "level": 2, "parent": "136", "group": 1, "nature": "Dư Nợ", "tip": "Theo dõi chênh lệch tỷ giá phát sinh trong quan hệ nội bộ."},
    {"code": "1363", "name": "Phải thu nội bộ về chi phí đi vay đủ điều kiện được vốn hoá", "level": 2, "parent": "136", "group": 1, "nature": "Dư Nợ", "tip": "Chi phí đi vay được vốn hóa phân bổ trong nội bộ."},
    {"code": "1368", "name": "Phải thu nội bộ khác", "level": 2, "parent": "136", "group": 1, "nature": "Dư Nợ", "tip": "Các khoản thanh toán bù trừ, vay mượn nội bộ khác."},
    {"code": "138", "name": "Phải thu khác", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Phải thu ngoài khách hàng và nội bộ (bồi thường, cho mượn...)."},
    {"code": "1381", "name": "Tài sản thiếu chờ xử lý", "level": 2, "parent": "138", "group": 1, "nature": "Dư Nợ", "tip": "Kiểm kê thấy mất/thiếu hàng tiền, chờ sếp quyết định xử lý."},
    {"code": "1383", "name": "Thuế TTĐB của hàng nhập khẩu", "level": 2, "parent": "138", "group": 1, "nature": "Dư Nợ", "tip": "Thuế tiêu thụ đặc biệt hàng nhập khẩu chờ khấu trừ/hoàn."},
    {"code": "1388", "name": "Phải thu khác", "level": 2, "parent": "138", "group": 1, "nature": "Dư Nợ", "tip": "Khoản phải thu khác (cho mượn tạm, cá nhân bồi thường...)."},
    {"code": "141", "name": "Tạm ứng", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "1-4-1: Giao tiền tạm ứng cho nhân viên đi công tác/mua đồ."},
    {"code": "151", "name": "Hàng mua đang đi đường", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Hàng đã trả tiền hoặc chấp nhận hóa đơn nhưng chưa nhập kho."},
    {"code": "152", "name": "Nguyên liệu, vật liệu", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Nguyên vật liệu chính, phụ tồn trong kho sản xuất."},
    {"code": "153", "name": "Công cụ, dụng cụ", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Tài sản không đủ tiêu chuẩn làm TSCĐ, dùng cho vận hành."},
    {"code": "154", "name": "Chi phí sản xuất, kinh doanh dở dang", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Tập hợp chi phí 621, 622, 623, 627 để tính giá thành sản phẩm."},
    {"code": "155", "name": "Sản phẩm", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Thành phẩm tự sản xuất đã nhập kho hoàn chỉnh."},
    {"code": "156", "name": "Hàng hóa", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Hàng mua về để bán lại (doanh nghiệp thương mại)."},
    {"code": "157", "name": "Hàng gửi đi bán", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Hàng gửi đại lý hoặc gửi cho khách chưa xác nhận mua."},
    {"code": "158", "name": "Nguyên liệu, vật tư tại kho bảo thuế", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Vật tư trong kho bảo thuế phục vụ sản xuất hàng xuất khẩu."},
    {"code": "171", "name": "Giao dịch mua, bán lại trái phiếu chính phủ", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Giao dịch Repo trái phiếu chính phủ."},
    {"code": "211", "name": "Tài sản cố định hữu hình", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Máy móc, nhà xưởng, phương tiện vận tải hiện hữu cầm nắm được."},
    {"code": "212", "name": "Tài sản cố định thuê tài chính", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Thuê dài hạn chuyển giao phần lớn rủi ro và lợi ích."},
    {"code": "213", "name": "Tài sản cố định vô hình", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Phần mềm, bằng sáng chế, bản quyền, quyền sử dụng đất."},
    {"code": "214", "name": "Hao mòn tài sản cố định", "level": 1, "parent": None, "group": 1, "nature": "Dư Có (TK điều chỉnh giảm tài sản)", "tip": "Tài khoản đặc biệt: thuộc tài sản (đầu 2) nhưng luôn Dư Có để ghi giảm giá trị tài sản."},
    {"code": "2141", "name": "Hao mòn TSCĐ hữu hình", "level": 2, "parent": "214", "group": 1, "nature": "Dư Có", "tip": "Khấu hao lũy kế máy móc, thiết bị, nhà xưởng."},
    {"code": "2142", "name": "Hao mòn TSCĐ thuê tài chính", "level": 2, "parent": "214", "group": 1, "nature": "Dư Có", "tip": "Khấu hao lũy kế tài sản đi thuê tài chính."},
    {"code": "2143", "name": "Hao mòn TSCĐ vô hình", "level": 2, "parent": "214", "group": 1, "nature": "Dư Có", "tip": "Khấu hao lũy kế phần mềm, quyền phát hành, bản quyền."},
    {"code": "2147", "name": "Hao mòn BĐSĐT", "level": 2, "parent": "214", "group": 1, "nature": "Dư Có", "tip": "Khấu hao bất động sản đầu tư cho thuê."},
    {"code": "215", "name": "Tài sản sinh học", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Động vật, cây trồng sống trong doanh nghiệp nông nghiệp."},
    {"code": "2151", "name": "Súc vật nuôi cho sản phẩm định kỳ", "level": 2, "parent": "215", "group": 1, "nature": "Dư Nợ", "tip": "Bò sữa, gà đẻ trứng, cừu lấy lông (cho sản phẩm nhiều lần)."},
    {"code": "21511", "name": "Súc vật nuôi cho sản phẩm định kỳ chưa đạt đến giai đoạn trưởng thành", "level": 3, "parent": "2151", "group": 1, "nature": "Dư Nợ", "tip": "Bê con đang lớn, gà con chưa đẻ."},
    {"code": "21512", "name": "Súc vật nuôi cho sản phẩm định kỳ đạt đến giai đoạn trưởng thành", "level": 3, "parent": "2151", "group": 1, "nature": "Dư Nợ", "tip": "Đàn bò sữa, đàn gà đã vào kỳ thu hoạch trứng/sữa."},
    {"code": "215121", "name": "Nguyên giá", "level": 4, "parent": "21512", "group": 1, "nature": "Dư Nợ", "tip": "Giá gốc hình thành súc vật nuôi trưởng thành."},
    {"code": "215122", "name": "Giá trị khấu hao lũy kế", "level": 4, "parent": "21512", "group": 1, "nature": "Dư Có", "tip": "Hao mòn lũy kế của vật nuôi sinh sản định kỳ."},
    {"code": "2152", "name": "Súc vật nuôi lấy sản phẩm một lần", "level": 2, "parent": "215", "group": 1, "nature": "Dư Nợ", "tip": "Heo thịt, bò thịt (nuôi lớn lấy thịt một lần duy nhất)."},
    {"code": "2153", "name": "Cây trồng theo mùa vụ hoặc lấy sản phẩm một lần", "level": 2, "parent": "215", "group": 1, "nature": "Dư Nợ", "tip": "Cây lúa, mía, sắn (thu hoạch một mùa xong hủy gốc)."},
    {"code": "217", "name": "Bất động sản đầu tư", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Nhà, đất nắm giữ để cho thuê hoặc chờ tăng giá bán kiếm lời."},
    {"code": "221", "name": "Đầu tư vào công ty con", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Nắm giữ trên 50% quyền biểu quyết chi phối công ty con."},
    {"code": "222", "name": "Đầu tư vào công ty liên doanh, liên kết", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Nắm giữ 20% đến 50% quyền biểu quyết có ảnh hưởng đáng kể."},
    {"code": "228", "name": "Đầu tư khác", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Đầu tư dài hạn dưới 20% vốn công ty khác."},
    {"code": "2281", "name": "Đầu tư góp vốn vào đơn vị khác", "level": 2, "parent": "228", "group": 1, "nature": "Dư Nợ", "tip": "Góp vốn cổ phần nhỏ, không có ảnh hưởng đáng kể."},
    {"code": "2288", "name": "Đầu tư khác", "level": 2, "parent": "228", "group": 1, "nature": "Dư Nợ", "tip": "Các khoản đầu tư dài hạn khác ngoài góp vốn."},
    {"code": "229", "name": "Dự phòng tổn thất tài sản", "level": 1, "parent": None, "group": 1, "nature": "Dư Có (TK điều chỉnh giảm tài sản)", "tip": "Dự phòng rủi ro tài sản mất giá, luôn Dư Có."},
    {"code": "2291", "name": "Dự phòng giảm giá chứng khoán kinh doanh", "level": 2, "parent": "229", "group": 1, "nature": "Dư Có", "tip": "Dự phòng giá cổ phiếu lướt sóng (121) bị rớt giá."},
    {"code": "2292", "name": "Dự phòng tổn thất đầu tư vào đơn vị khác", "level": 2, "parent": "229", "group": 1, "nature": "Dư Có", "tip": "Dự phòng công ty nhận vốn đầu tư bị thua lỗ."},
    {"code": "2293", "name": "Dự phòng phải thu khó đòi", "level": 2, "parent": "229", "group": 1, "nature": "Dư Có", "tip": "Dự phòng nợ xấu khách hàng (131) quá hạn khó đòi."},
    {"code": "2294", "name": "Dự phòng giảm giá hàng tồn kho", "level": 2, "parent": "229", "group": 1, "nature": "Dư Có", "tip": "Dự phòng hàng hóa trong kho (152, 156) bị lỗi thời, giảm giá."},
    {"code": "2295", "name": "Dự phòng tổn thất tài sản sinh học", "level": 2, "parent": "229", "group": 1, "nature": "Dư Có", "tip": "Dự phòng dịch bệnh, thiên tai làm giảm giá tài sản sinh học (215)."},
    {"code": "241", "name": "Xây dựng cơ bản dở dang", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Đang xây nhà xưởng, lắp đặt dây chuyền chưa hoàn thành."},
    {"code": "2411", "name": "Mua sắm TSCĐ", "level": 2, "parent": "241", "group": 1, "nature": "Dư Nợ", "tip": "Chi phí mua máy móc đang chờ lắp đặt bàn giao."},
    {"code": "2412", "name": "Xây dựng cơ bản", "level": 2, "parent": "241", "group": 1, "nature": "Dư Nợ", "tip": "Công trình nhà xưởng, văn phòng đang thi công dở dang."},
    {"code": "2413", "name": "Sửa chữa, bảo dưỡng định kỳ TSCĐ", "level": 2, "parent": "241", "group": 1, "nature": "Dư Nợ", "tip": "Chi phí đại tu, bảo dưỡng lớn tài sản cố định."},
    {"code": "2414", "name": "Nâng cấp, cải tạo TSCĐ", "level": 2, "parent": "241", "group": 1, "nature": "Dư Nợ", "tip": "Cải tạo nâng cao công suất, tuổi thọ tài sản cố định."},
    {"code": "242", "name": "Chi phí chờ phân bổ", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Chi phí trả trước tiền thuê nhà 1-2 năm, phân bổ dần vào chi phí các kỳ."},
    {"code": "243", "name": "Tài sản thuế thu nhập hoãn lại", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Thuế TNDN được giảm trừ trong tương lai do chênh lệch tạm thời."},
    {"code": "244", "name": "Ký quỹ, ký cược", "level": 1, "parent": None, "group": 1, "nature": "Dư Nợ", "tip": "Mang tiền đi đặt cọc cho bên ngoài để thuê nhà hoặc thực hiện hợp đồng."},

    # Nhóm 2: Nợ phải trả
    {"code": "331", "name": "Phải trả cho người bán", "level": 1, "parent": None, "group": 2, "nature": "Lưỡng tính (thường Dư Có)", "tip": "Đối ứng với 131. Mua hàng chưa trả tiền cho nhà cung cấp."},
    {"code": "332", "name": "Phải trả cổ tức, lợi nhuận", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Nghị quyết đại hội đã duyệt chia cổ tức nhưng tiền chưa chuyển cho cổ đông."},
    {"code": "333", "name": "Thuế và các khoản phải nộp Nhà nước", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Ba số 3: các khoản nợ thuế với cơ quan thuế nhà nước."},
    {"code": "3331", "name": "Thuế giá trị gia tăng phải nộp", "level": 2, "parent": "333", "group": 2, "nature": "Dư Có", "tip": "Thuế GTGT phải nộp vào ngân sách."},
    {"code": "33311", "name": "Thuế GTGT đầu ra", "level": 3, "parent": "3331", "group": 2, "nature": "Dư Có", "tip": "Thuế GTGT thu của khách khi bán hàng ra."},
    {"code": "33312", "name": "Thuế GTGT hàng nhập khẩu", "level": 3, "parent": "3331", "group": 2, "nature": "Dư Có", "tip": "Thuế GTGT phải nộp tại hải quan khi nhập khẩu hàng."},
    {"code": "3332", "name": "Thuế tiêu thụ đặc biệt", "level": 2, "parent": "333", "group": 2, "nature": "Dư Có", "tip": "Đuôi 2: Thuế TTĐB (rượu, bia, thuốc lá, ô tô...)."},
    {"code": "3333", "name": "Thuế xuất, nhập khẩu", "level": 2, "parent": "333", "group": 2, "nature": "Dư Có", "tip": "Bốn số 3: Thuế xuất khẩu và thuế nhập khẩu."},
    {"code": "3334", "name": "Thuế thu nhập doanh nghiệp", "level": 2, "parent": "333", "group": 2, "nature": "Dư Có", "tip": "Đuôi 4: Thuế TNDN tính trên lợi nhuận kinh doanh."},
    {"code": "3335", "name": "Thuế thu nhập cá nhân", "level": 2, "parent": "333", "group": 2, "nature": "Dư Có", "tip": "Đuôi 5: Thuế TNCN khấu trừ từ lương người lao động."},
    {"code": "3336", "name": "Thuế tài nguyên", "level": 2, "parent": "333", "group": 2, "nature": "Dư Có", "tip": "Đuôi 6: Thuế khai thác khoáng sản, nước ngầm, dầu khí."},
    {"code": "3337", "name": "Thuế nhà đất, tiền thuê đất", "level": 2, "parent": "333", "group": 2, "nature": "Dư Có", "tip": "Đuôi 7: Tiền thuê đất công nghiệp, thuế nhà đất."},
    {"code": "3338", "name": "Thuế bảo vệ môi trường và các loại thuế khác", "level": 2, "parent": "333", "group": 2, "nature": "Dư Có", "tip": "Thuế bảo vệ môi trường xăng dầu, túi ni lông..."},
    {"code": "33381", "name": "Thuế bảo vệ môi trường", "level": 3, "parent": "3338", "group": 2, "nature": "Dư Có", "tip": "Khoản thuế bảo vệ môi trường chi tiết."},
    {"code": "33382", "name": "Các loại thuế khác", "level": 3, "parent": "3338", "group": 2, "nature": "Dư Có", "tip": "Các loại thuế phát sinh khác ngoài các tài khoản trên."},
    {"code": "3339", "name": "Phí, lệ phí và các khoản phải nộp khác", "level": 2, "parent": "333", "group": 2, "nature": "Dư Có", "tip": "Lệ phí môn bài, phí cầu đường, phí chứng thực..."},
    {"code": "334", "name": "Phải trả người lao động", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Lương và thưởng phải trả cho cán bộ công nhân viên."},
    {"code": "335", "name": "Chi phí phải trả", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Chi phí đã phát sinh trong kỳ nhưng chưa có hóa đơn (trích trước chi phí)."},
    {"code": "336", "name": "Phải trả nội bộ", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Khoản nợ giữa đơn vị trực thuộc với công ty mẹ."},
    {"code": "3361", "name": "Phải trả nội bộ về vốn kinh doanh", "level": 2, "parent": "336", "group": 2, "nature": "Dư Có", "tip": "Vốn do đơn vị cấp trên cấp xuống phải theo dõi hoàn trả."},
    {"code": "3362", "name": "Phải trả nội bộ về chênh lệch tỷ giá", "level": 2, "parent": "336", "group": 2, "nature": "Dư Có", "tip": "Khoản nợ chênh lệch tỷ giá chuyển giao nội bộ."},
    {"code": "3363", "name": "Phải trả nội bộ về chi phí đi vay đủ điều kiện được vốn hóa", "level": 2, "parent": "336", "group": 2, "nature": "Dư Có", "tip": "Chi phí lãi vay công ty mẹ đi vay thay cho đơn vị thành viên."},
    {"code": "3368", "name": "Phải trả nội bộ khác", "level": 2, "parent": "336", "group": 2, "nature": "Dư Có", "tip": "Các khoản vay mượn và thanh toán nội bộ khác."},
    {"code": "337", "name": "Thanh toán theo tiến độ hợp đồng xây dựng", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Nhận tiền thanh toán theo tiến độ nghiệm thu từng giai đoạn."},
    {"code": "338", "name": "Phải trả, phải nộp khác", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Nợ bảo hiểm, công đoàn, doanh thu chưa thực hiện."},
    {"code": "3381", "name": "Tài sản thừa chờ giải quyết", "level": 2, "parent": "338", "group": 2, "nature": "Dư Có", "tip": "Kiểm kê kho thấy thừa hàng, tạm treo chờ tìm nguyên nhân."},
    {"code": "3382", "name": "Kinh phí công đoàn", "level": 2, "parent": "338", "group": 2, "nature": "Dư Có", "tip": "2% kinh phí công đoàn trích nộp liên đoàn lao động."},
    {"code": "3383", "name": "Bảo hiểm xã hội", "level": 2, "parent": "338", "group": 2, "nature": "Dư Có", "tip": "Khoản trích BHXH (người sử dụng lao động + người lao động đóng)."},
    {"code": "3384", "name": "Bảo hiểm y tế", "level": 2, "parent": "338", "group": 2, "nature": "Dư Có", "tip": "Khoản trích BHYT nộp cơ quan bảo hiểm."},
    {"code": "3386", "name": "Bảo hiểm thất nghiệp", "level": 2, "parent": "338", "group": 2, "nature": "Dư Có", "tip": "Khoản trích BHTN nộp cơ quan bảo hiểm."},
    {"code": "3387", "name": "Doanh thu chờ phân bổ", "level": 2, "parent": "338", "group": 2, "nature": "Dư Có", "tip": "Khách trả trước tiền thuê nhà nhiều kỳ, ghi nhận treo ở đây."},
    {"code": "3388", "name": "Phải trả, phải nộp khác", "level": 2, "parent": "338", "group": 2, "nature": "Dư Có", "tip": "Các khoản mượn tạm, tiền thu hộ bên ngoài khác."},
    {"code": "341", "name": "Vay và nợ thuê tài chính", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Vay ngân hàng ngắn/dài hạn và nghĩa vụ nợ thuê tài sản."},
    {"code": "3411", "name": "Các khoản đi vay", "level": 2, "parent": "341", "group": 2, "nature": "Dư Có", "tip": "Gốc vay ngân hàng hoặc các tổ chức tín dụng."},
    {"code": "3412", "name": "Nợ thuê tài chính", "level": 2, "parent": "341", "group": 2, "nature": "Dư Có", "tip": "Nợ tiền gốc hợp đồng thuê tài chính tài sản."},
    {"code": "343", "name": "Trái phiếu phát hành", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Công ty phát hành trái phiếu để huy động vốn nợ ngoài thị trường."},
    {"code": "3431", "name": "Trái phiếu thường", "level": 2, "parent": "343", "group": 2, "nature": "Dư Có", "tip": "Trái phiếu trả lãi cố định không chuyển đổi thành cổ phiếu."},
    {"code": "3432", "name": "Trái phiếu chuyển đổi", "level": 2, "parent": "343", "group": 2, "nature": "Dư Có", "tip": "Trái phiếu có quyền đổi thành cổ phiếu thường khi đáo hạn."},
    {"code": "344", "name": "Nhận ký quỹ, ký cược", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Bên ngoài đặt cọc tiền cho mình để đảm bảo hợp đồng đại lý/cho thuê."},
    {"code": "347", "name": "Thuế thu nhập hoãn lại phải trả", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Thuế TNDN sẽ phải nộp thêm trong tương lai do chênh lệch tạm thời chịu thuế."},
    {"code": "352", "name": "Dự phòng phải trả", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Trích trước chi phí bảo hành sản phẩm, tái cơ cấu dự kiến."},
    {"code": "3521", "name": "Dự phòng bảo hành sản phẩm, hàng hóa", "level": 2, "parent": "352", "group": 2, "nature": "Dư Có", "tip": "Dự phòng chi phí sửa chữa bảo hành máy móc thiết bị bán ra."},
    {"code": "3522", "name": "Dự phòng bảo hành công trình xây dựng", "level": 2, "parent": "352", "group": 2, "nature": "Dư Có", "tip": "Dự phòng bảo hành tòa nhà, cầu đường đã bàn giao nghiệm thu."},
    {"code": "3523", "name": "Dự phòng tái cơ cấu doanh nghiệp", "level": 2, "parent": "352", "group": 2, "nature": "Dư Có", "tip": "Chi phí đền bù thôi việc, đóng cửa nhà máy khi tái cấu trúc."},
    {"code": "3525", "name": "Dự phòng phải trả khác", "level": 2, "parent": "352", "group": 2, "nature": "Dư Có", "tip": "Các khoản dự phòng phải trả pháp lý, kiện tụng khác."},
    {"code": "353", "name": "Quỹ khen thưởng, phúc lợi", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Trích từ lợi nhuận sau thuế để thưởng nhân viên và hoạt động công đoàn/phúc lợi."},
    {"code": "3531", "name": "Quỹ khen thưởng", "level": 2, "parent": "353", "group": 2, "nature": "Dư Có", "tip": "Tiền thưởng cuối năm, thành tích xuất sắc của người lao động."},
    {"code": "3532", "name": "Quỹ phúc lợi", "level": 2, "parent": "353", "group": 2, "nature": "Dư Có", "tip": "Du lịch, thăm hỏi ốm đau, hiếu hỷ người lao động."},
    {"code": "3533", "name": "Quỹ phúc lợi đã hình thành TSCĐ", "level": 2, "parent": "353", "group": 2, "nature": "Dư Có", "tip": "Mua xe đưa đón nhân viên, xây nhà nghỉ mát bằng quỹ phúc lợi."},
    {"code": "3534", "name": "Quỹ thưởng ban quản lý điều hành công ty", "level": 2, "parent": "353", "group": 2, "nature": "Dư Có", "tip": "Quỹ thưởng dành riêng cho Hội đồng quản trị, Ban giám đốc."},
    {"code": "356", "name": "Quỹ phát triển khoa học và công nghệ", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Quỹ trích trước thuế để phục vụ hoạt động R&D, công nghệ."},
    {"code": "3561", "name": "Quỹ phát triển khoa học và công nghệ", "level": 2, "parent": "356", "group": 2, "nature": "Dư Có", "tip": "Số tiền quỹ đang sẵn sàng chi dùng cho đề tài nghiên cứu."},
    {"code": "3562", "name": "Quỹ phát triển khoa học và công nghệ đã hình thành tài sản", "level": 2, "parent": "356", "group": 2, "nature": "Dư Có", "tip": "Phòng lab, máy đo kiểm đã mua sắm bằng quỹ KHCN."},
    {"code": "357", "name": "Quỹ bình ổn giá", "level": 1, "parent": None, "group": 2, "nature": "Dư Có", "tip": "Trích quỹ theo quy định nhà nước để can thiệp bình ổn giá (xăng dầu...)."},

    # Nhóm 3: Vốn chủ sở hữu
    {"code": "411", "name": "Vốn đầu tư của chủ sở hữu", "level": 1, "parent": None, "group": 3, "nature": "Dư Có", "tip": "Vốn góp thực tế của các cổ đông/chủ doanh nghiệp."},
    {"code": "4111", "name": "Vốn góp của chủ sở hữu", "level": 2, "parent": "411", "group": 3, "nature": "Dư Có", "tip": "Mệnh giá cổ phiếu đã phát hành hoặc vốn điều lệ đã góp."},
    {"code": "41111", "name": "Cổ phiếu phổ thông có quyền biểu quyết", "level": 3, "parent": "4111", "group": 3, "nature": "Dư Có", "tip": "Cổ phiếu bình thường được bỏ phiếu tại đại hội đồng cổ đông."},
    {"code": "41112", "name": "Cổ phiếu ưu đãi", "level": 3, "parent": "4111", "group": 3, "nature": "Dư Có", "tip": "Cổ phiếu ưu đãi cổ tức hoặc hoàn lại."},
    {"code": "4112", "name": "Thặng dư vốn", "level": 2, "parent": "411", "group": 3, "nature": "Dư Có (hoặc Dư Nợ nếu âm)", "tip": "Chênh lệch giữa giá phát hành bán cổ phiếu và mệnh giá 10.000đ."},
    {"code": "4113", "name": "Quyền chọn chuyển đổi trái phiếu", "level": 2, "parent": "411", "group": 3, "nature": "Dư Có", "tip": "Cấu phần vốn chủ của trái phiếu chuyển đổi."},
    {"code": "4118", "name": "Vốn khác", "level": 2, "parent": "411", "group": 3, "nature": "Dư Có", "tip": "Vốn được biếu tặng, bổ sung từ kết quả kinh doanh khác."},
    {"code": "412", "name": "Chênh lệch đánh giá lại tài sản", "level": 1, "parent": None, "group": 3, "nature": "Dư Có hoặc Dư Nợ", "tip": "Đánh giá lại giá trị nhà xưởng, đất đai theo quyết định của nhà nước/hợp nhất."},
    {"code": "413", "name": "Chênh lệch tỷ giá hối đoái", "level": 1, "parent": None, "group": 3, "nature": "Dư Có hoặc Dư Nợ", "tip": "Chênh lệch tỷ giá hối đoái chưa xử lý khi chuyển đổi BCTC."},
    {"code": "414", "name": "Quỹ đầu tư phát triển", "level": 1, "parent": None, "group": 3, "nature": "Dư Có", "tip": "Quỹ trích từ lãi sau thuế để tái đầu tư mở rộng nhà xưởng, kinh doanh."},
    {"code": "418", "name": "Các quỹ khác thuộc vốn chủ sở hữu", "level": 1, "parent": None, "group": 3, "nature": "Dư Có", "tip": "Các quỹ dự phòng tài chính, quỹ đặc thù theo điều lệ công ty."},
    {"code": "419", "name": "Cổ phiếu mua lại của chính mình", "level": 1, "parent": None, "group": 3, "nature": "Dư Nợ (TK điều chỉnh giảm vốn chủ)", "tip": "Cổ phiếu quỹ: mua lại cổ phiếu của chính mình để giảm lượng lưu hành. Luôn Dư Nợ."},
    {"code": "421", "name": "Lợi nhuận sau thuế chưa phân phối", "level": 1, "parent": None, "group": 3, "nature": "Lưỡng tính (Lãi Dư Có, Lỗ Dư Nợ)", "tip": "Lợi nhuận ròng tích lũy chưa chia cổ tức hoặc bù đắp các quỹ."},
    {"code": "4211", "name": "Lợi nhuận sau thuế chưa phân phối lũy kế đến cuối năm trước", "level": 2, "parent": "421", "group": 3, "nature": "Lưỡng tính", "tip": "Lãi/lỗ dồn tích từ các năm tài chính trước mang sang."},
    {"code": "4212", "name": "Lợi nhuận sau thuế chưa phân phối năm nay", "level": 2, "parent": "421", "group": 3, "nature": "Lưỡng tính", "tip": "Kết quả lãi/lỗ phát sinh trong chính năm tài chính này."},

    # Nhóm 4: Doanh thu
    {"code": "511", "name": "Doanh thu bán hàng và cung cấp dịch vụ", "level": 1, "parent": None, "group": 4, "nature": "Không số dư (kết chuyển)", "tip": "Doanh thu hoạt động kinh doanh chính (bán sản phẩm, hàng hóa, dịch vụ)."},
    {"code": "515", "name": "Doanh thu hoạt động tài chính", "level": 1, "parent": None, "group": 4, "nature": "Không số dư (kết chuyển)", "tip": "Lãi tiền gửi tiết kiệm, lãi bán chứng khoán, cổ tức nhận được, lãi chênh lệch tỷ giá."},
    {"code": "521", "name": "Các khoản giảm trừ doanh thu", "level": 1, "parent": None, "group": 4, "nature": "Không số dư (kết chuyển)", "tip": "Chiết khấu thương mại, giảm giá hàng bán, hàng bán bị trả lại. Làm giảm doanh thu thuần."},

    # Nhóm 5: Chi phí sản xuất, kinh doanh
    {"code": "621", "name": "Chi phí nguyên liệu, vật liệu trực tiếp", "level": 1, "parent": None, "group": 5, "nature": "Không số dư (kết chuyển sang 154)", "tip": "Vải may áo, thép đúc máy tính trực tiếp cho sản phẩm."},
    {"code": "622", "name": "Chi phí nhân công trực tiếp", "level": 1, "parent": None, "group": 5, "nature": "Không số dư (kết chuyển sang 154)", "tip": "Lương công nhân trực tiếp may, trực tiếp đứng máy cơ khí."},
    {"code": "623", "name": "Chi phí sử dụng máy thi công", "level": 1, "parent": None, "group": 5, "nature": "Không số dư (kết chuyển sang 154)", "tip": "Chỉ dùng cho đơn vị xây dựng: cần cẩu, máy xúc, máy ủi công trình."},
    {"code": "6231", "name": "Chi phí nhân công", "level": 2, "parent": "623", "group": 5, "nature": "Không số dư", "tip": "Lương tài xế lái máy ủi, cẩu, máy lu công trường."},
    {"code": "6232", "name": "Chi phí vật liệu", "level": 2, "parent": "623", "group": 5, "nature": "Không số dư", "tip": "Xăng, dầu, mỡ bôi trơn máy móc thi công."},
    {"code": "6233", "name": "Chi phí dụng cụ sản xuất", "level": 2, "parent": "623", "group": 5, "nature": "Không số dư", "tip": "Kẹp, xích, dụng cụ phụ trợ máy thi công."},
    {"code": "6234", "name": "Chi phí khấu hao máy thi công", "level": 2, "parent": "623", "group": 5, "nature": "Không số dư", "tip": "Khấu hao tài sản máy đào, máy trộn bê tông."},
    {"code": "6237", "name": "Chi phí dịch vụ mua ngoài", "level": 2, "parent": "623", "group": 5, "nature": "Không số dư", "tip": "Thuê ngoài sửa chữa, thuê đơn vị ngoài vận hành máy."},
    {"code": "6238", "name": "Chi phí bằng tiền khác", "level": 2, "parent": "623", "group": 5, "nature": "Không số dư", "tip": "Chi phí tiền mặt khác phục vụ máy thi công."},
    {"code": "627", "name": "Chi phí sản xuất chung", "level": 1, "parent": None, "group": 5, "nature": "Không số dư (kết chuyển sang 154)", "tip": "Chi phí phục vụ phân xưởng sản xuất: quản đốc, điện nước phân xưởng."},
    {"code": "6271", "name": "Chi phí nhân viên phân xưởng", "level": 2, "parent": "627", "group": 5, "nature": "Không số dư", "tip": "Lương quản đốc, kỹ thuật viên giám sát phân xưởng."},
    {"code": "6272", "name": "Chi phí vật liệu", "level": 2, "parent": "627", "group": 5, "nature": "Không số dư", "tip": "Vật liệu lau chùi máy móc, giẻ lau, bóng đèn phân xưởng."},
    {"code": "6273", "name": "Chi phí dụng cụ sản xuất", "level": 2, "parent": "627", "group": 5, "nature": "Không số dư", "tip": "Búa, kìm, đai bảo hộ lao động trang bị cho phân xưởng."},
    {"code": "6274", "name": "Chi phí khấu hao TSCĐ", "level": 2, "parent": "627", "group": 5, "nature": "Không số dư", "tip": "Khấu hao nhà xưởng sản xuất và thiết bị chung."},
    {"code": "6275", "name": "Thuế, phí, lệ phí", "level": 2, "parent": "627", "group": 5, "nature": "Không số dư", "tip": "Thuế nhà đất phân xưởng, phí bảo vệ môi trường phân xưởng."},
    {"code": "6277", "name": "Chi phí dịch vụ mua ngoài", "level": 2, "parent": "627", "group": 5, "nature": "Không số dư", "tip": "Tiền điện, nước, điện thoại, internet dùng tại phân xưởng."},
    {"code": "6278", "name": "Chi phí bằng tiền khác", "level": 2, "parent": "627", "group": 5, "nature": "Không số dư", "tip": "Tiếp khách tại phân xưởng, chi phí lặt vặt tại xưởng."},
    {"code": "632", "name": "Giá vốn hàng bán", "level": 1, "parent": None, "group": 5, "nature": "Không số dư (kết chuyển sang 911)", "tip": "Giá xuất kho của sản phẩm, hàng hóa tiêu thụ trong kỳ."},
    {"code": "635", "name": "Chi phí tài chính", "level": 1, "parent": None, "group": 5, "nature": "Không số dư (kết chuyển sang 911)", "tip": "Lãi tiền vay ngân hàng phải trả, lỗ tỷ giá hối đoái, chiết khấu thanh toán cho khách."},
    {"code": "641", "name": "Chi phí bán hàng", "level": 1, "parent": None, "group": 5, "nature": "Không số dư (kết chuyển sang 911)", "tip": "Mọi chi phí đưa hàng hóa đến tay người tiêu dùng: quảng cáo, showroom, nhân viên bán hàng."},
    {"code": "6411", "name": "Chi phí nhân viên", "level": 2, "parent": "641", "group": 5, "nature": "Không số dư", "tip": "Lương nhân viên bán hàng, telesale, nhân viên tiếp thị."},
    {"code": "6412", "name": "Chi phí vật liệu, bao bì", "level": 2, "parent": "641", "group": 5, "nature": "Không số dư", "tip": "Túi đựng hàng, hộp carton đóng gói, vật liệu bọc hàng."},
    {"code": "6413", "name": "Chi phí dụng cụ, đồ dùng", "level": 2, "parent": "641", "group": 5, "nature": "Không số dư", "tip": "Máy quét mã vạch, giá kệ trưng bày cửa hàng."},
    {"code": "6414", "name": "Chi phí khấu hao TSCĐ", "level": 2, "parent": "641", "group": 5, "nature": "Không số dư", "tip": "Khấu hao showroom, ô tô tải chở hàng bán lẻ."},
    {"code": "6415", "name": "Thuế, phí, lệ phí", "level": 2, "parent": "641", "group": 5, "nature": "Không số dư", "tip": "Lệ phí chợ, bến bãi, cầu phà trong quá trình bán hàng."},
    {"code": "6417", "name": "Chi phí dịch vụ mua ngoài", "level": 2, "parent": "641", "group": 5, "nature": "Không số dư", "tip": "Thuê chạy quảng cáo Facebook/Google, thuê mặt bằng cửa hàng."},
    {"code": "6418", "name": "Chi phí bằng tiền khác", "level": 2, "parent": "641", "group": 5, "nature": "Không số dư", "tip": "Tiếp khách bán hàng, hoa hồng giới thiệu khách hàng."},
    {"code": "642", "name": "Chi phí quản lý doanh nghiệp", "level": 1, "parent": None, "group": 5, "nature": "Không số dư (kết chuyển sang 911)", "tip": "Chi phí vận hành bộ máy văn phòng công ty: ban giám đốc, kế toán, nhân sự."},
    {"code": "6421", "name": "Chi phí nhân viên quản lý", "level": 2, "parent": "642", "group": 5, "nature": "Không số dư", "tip": "Lương ban giám đốc, kế toán trưởng, nhân sự, IT văn phòng."},
    {"code": "6422", "name": "Chi phí vật liệu quản lý", "level": 2, "parent": "642", "group": 5, "nature": "Không số dư", "tip": "Giấy in A4, mực in hóa đơn, sổ sách văn phòng."},
    {"code": "6423", "name": "Chi phí đồ dùng văn phòng", "level": 2, "parent": "642", "group": 5, "nature": "Không số dư", "tip": "Bàn ghế giám đốc, máy tính xách tay phân bổ ngắn hạn."},
    {"code": "6424", "name": "Chi phí khấu hao TSCĐ", "level": 2, "parent": "642", "group": 5, "nature": "Không số dư", "tip": "Khấu hao tòa nhà trụ sở công ty, xe đưa đón ban giám đốc."},
    {"code": "6425", "name": "Thuế, phí và lệ phí", "level": 2, "parent": "642", "group": 5, "nature": "Không số dư", "tip": "Lệ phí môn bài công ty, thuế đất trụ sở chính."},
    {"code": "6426", "name": "Chi phí dự phòng", "level": 2, "parent": "642", "group": 5, "nature": "Không số dư", "tip": "Trích lập dự phòng phải thu khó đòi (2293) đưa vào chi phí QLDN."},
    {"code": "6427", "name": "Chi phí dịch vụ mua ngoài", "level": 2, "parent": "642", "group": 5, "nature": "Không số dư", "tip": "Tiền điện văn phòng, thuê trụ sở chính, phí kiểm toán độc lập."},
    {"code": "6428", "name": "Chi phí bằng tiền khác", "level": 2, "parent": "642", "group": 5, "nature": "Không số dư", "tip": "Công tác phí của sếp, hội nghị khách hàng doanh nghiệp."},

    # Nhóm 6: Thu nhập khác
    {"code": "711", "name": "Thu nhập khác", "level": 1, "parent": None, "group": 6, "nature": "Không số dư (kết chuyển sang 911)", "tip": "Thu từ nhượng bán thanh lý TSCĐ, thu tiền phạt hợp đồng vi phạm của đối tác."},

    # Nhóm 7: Chi phí khác
    {"code": "811", "name": "Chi phí khác", "level": 1, "parent": None, "group": 7, "nature": "Không số dư (kết chuyển sang 911)", "tip": "Giá trị còn lại TSCĐ thanh lý, tiền bị phạt do vi phạm hợp đồng/thuế."},
    {"code": "821", "name": "Chi phí thuế thu nhập doanh nghiệp", "level": 1, "parent": None, "group": 7, "nature": "Không số dư (kết chuyển sang 911)", "tip": "Tổng chi phí thuế TNDN (hiện hành + hoãn lại) tính vào kết quả kinh doanh kỳ này."},
    {"code": "8211", "name": "Chi phí thuế TNDN hiện hành", "level": 2, "parent": "821", "group": 7, "nature": "Không số dư", "tip": "Thuế TNDN thực tế phải nộp năm nay tính trên thu nhập chịu thuế."},
    {"code": "82111", "name": "Chi phí thuế thu nhập doanh nghiệp hiện hành theo quy định của Luật thuế thu nhập doanh nghiệp", "level": 3, "parent": "8211", "group": 7, "nature": "Không số dư", "tip": "Thuế TNDN tính theo thuế suất thông thường luật thuế nội địa."},
    {"code": "82112", "name": "Chi phí thuế thu nhập doanh nghiệp bổ sung theo quy định về thuế tối thiểu toàn cầu", "level": 3, "parent": "8211", "group": 7, "nature": "Không số dư", "tip": "Thuế bổ sung áp dụng cho các tập đoàn đa quốc gia theo quy định Thuế tối thiểu toàn cầu (Pillar 2)."},
    {"code": "8212", "name": "Chi phí thuế TNDN hoãn lại", "level": 2, "parent": "821", "group": 7, "nature": "Không số dư", "tip": "Chi phí thuế hoàn lại phát sinh do chênh lệch tạm thời giữa kế toán và thuế."},

    # Nhóm 8: Xác định kết quả kinh doanh
    {"code": "911", "name": "Xác định kết quả kinh doanh", "level": 1, "parent": None, "group": 8, "nature": "Không số dư (tập hợp lãi lỗ)", "tip": "Cân đo đong đếm: Bên Có tập hợp doanh thu (511, 515, 711), Bên Nợ tập hợp chi phí (632, 635, 641, 642, 811, 821). Chênh lệch chuyển sang 421."}
]

# Build index and children
accounts_dict = {a["code"]: a for a in accounts_data}
for acc in accounts_data:
    acc["children"] = []

for acc in accounts_data:
    if acc["parent"] and acc["parent"] in accounts_dict:
        accounts_dict[acc["parent"]]["children"].append(acc["code"])

# Verify counts and structure
print(f"Total accounts extracted: {len(accounts_data)}")
level_counts = {}
for acc in accounts_data:
    level_counts[acc["level"]] = level_counts.get(acc["level"], 0) + 1
print(f"By level: {level_counts}")

group_counts = {}
for acc in accounts_data:
    group_counts[acc["group"]] = group_counts.get(acc["group"], 0) + 1
print(f"By group: {group_counts}")

output = {
    "metadata": {
        "title": "Hệ thống tài khoản kế toán doanh nghiệp Việt Nam",
        "standard": "Thông tư số 99/2025/TT-BTC ngày 27/10/2025 của Bộ trưởng Bộ Tài chính",
        "total_accounts": len(accounts_data),
        "total_groups": len(raw_groups)
    },
    "groups": raw_groups,
    "accounts": accounts_data
}

with open("data/accounts.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("data/accounts.json generated successfully!")
