export default function About() {
  return (
    <section className="page-section about-page" id="thong-tin">
      <div className="container narrow">

        {/* ==================== GIỚI THIỆU ==================== */}
        <div className="about-intro-card">
          <span className="about-card-label about-intro-highlight">
            Cùng khám phá những sắc màu văn hóa tại HCMUE
          </span>

          <h2 className="about-intro-title">
            NGÀY HỘI GIAO LƯU VĂN HÓA QUỐC TẾ
          </h2>

          <p>
            Ngày hội được tổ chức nhằm chào mừng kỷ niệm{" "}
            <strong className="about-blue-emphasis about-anniversary-text">
              <em>
                50 năm Ngày truyền thống Trường Đại học Sư phạm Thành phố Hồ
                Chí Minh
              </em>
            </strong>
            , đồng thời tạo nên một không gian giao lưu, trải nghiệm văn hóa đa
            quốc gia dành cho người học, viên chức, người lao động, khách mời
            trong nước và quốc tế.
          </p>

          <p>
            Thông qua các hoạt động về trang phục, ẩm thực, ngôn ngữ, trò chơi
            dân gian và nghệ thuật, Ngày hội giới thiệu những nét đặc trưng
            của{" "}
            <strong className="about-blue-emphasis">
              07 không gian văn hóa:
            </strong>{" "}
            <strong className="about-red-emphasis">
              Việt Nam, Trung Quốc, Hàn Quốc, Nhật Bản, Pháp, Nga và Anh.
            </strong>
          </p>

          <p>
            Các hoạt động được tổ chức theo hướng tương tác và trải nghiệm,
            qua đó tăng cường sự hiểu biết, tôn trọng khác biệt và kết nối
            giữa người học, khách mời trong nước và quốc tế.
          </p>
        </div>


        {/* ==================== 07 KHÔNG GIAN VĂN HÓA ==================== */}
        <div className="about-section-block">
          <div className="about-section-heading">
            <span className="about-section-icon">🌏</span>

            <div>
              <h2 className="about-culture-title">
                KHÔNG GIAN VĂN HÓA
              </h2>
            </div>
          </div>

          <p className="about-section-intro">
            Ngày hội giới thiệu{" "}
            <strong className="about-blue-emphasis">
              07 không gian văn hóa
            </strong>{" "}
            Việt Nam, Trung Quốc, Hàn Quốc, Nhật Bản, Pháp, Nga và Anh. Mỗi
            gian hàng mang đến những trải nghiệm đa dạng thông qua trang phục,
            biểu tượng, trò chơi dân gian, nghệ thuật thủ công và thực hành
            ngôn ngữ.
          </p>

          <div className="about-culture-grid">
            {[
              "Việt Nam",
              "Trung Quốc",
              "Hàn Quốc",
              "Nhật Bản",
              "Pháp",
              "Nga",
              "Anh",
            ].map((country, index) => (
              <div className="about-culture-item" key={country}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{country}</strong>
              </div>
            ))}
          </div>

          <div className="about-culture-features">
            <div>
              <strong>Trang phục & biểu tượng</strong>

              <p>
                Trưng bày, thử trang phục và giải thích ý nghĩa lịch sử - văn
                hóa của các biểu tượng.
              </p>
            </div>

            <div>
              <strong>Trò chơi & nghệ thuật thủ công</strong>

              <p>
                Tổ chức trò chơi dân gian có hướng dẫn, kết hợp trải nghiệm
                nghệ thuật thủ công và tìm hiểu đặc trưng văn hóa.
              </p>
            </div>

            <div>
              <strong>Thực hành ngôn ngữ</strong>

              <p>
                Tạo không gian để người tham gia thực hành và khám phá ngôn
                ngữ của các quốc gia.
              </p>
            </div>
          </div>
        </div>


        {/* ==================== ẨM THỰC + LỄ HỘI ==================== */}
        <div className="about-feature-grid">
          <div className="about-feature-card">
            <span className="about-feature-icon">🍜</span>

            <span className="about-section-label about-feature-label">
              TRẢI NGHIỆM
            </span>

            <h2 className="about-feature-title">
              Không gian ẩm thực
            </h2>

            <p>
              Trưng bày và phục vụ các món ăn truyền thống, kết hợp thuyết
              minh về nguyên liệu, cách thức thực hiện và tập quán ăn uống.
            </p>
          </div>


          <div className="about-feature-card">
            <span className="about-feature-icon">🎮</span>

            <span className="about-section-label about-feature-label">
              TƯƠNG TÁC
            </span>

            <h2 className="about-feature-title">
              Không gian lễ hội
            </h2>

            <p>
              Tổ chức các trò chơi dân gian và trò chơi vận động đặc trưng của
              các quốc gia, dân tộc.
            </p>
          </div>
        </div>


        {/* ==================== CHƯƠNG TRÌNH NGHỆ THUẬT ==================== */}
        <div className="about-performance-card">
          <div className="about-performance-heading">
            <span className="about-feature-icon">🎭</span>

            <div>
              <h2 className="about-performance-title">
                CHƯƠNG TRÌNH NGHỆ THUẬT
              </h2>
            </div>
          </div>

          <p>
            Chương trình văn nghệ gồm văn nghệ mở màn, phát biểu của lãnh đạo
            Trường và trình diễn tóm lược “Sắc phục 7 quốc gia” có thuyết minh
            về giá trị văn hóa. Chương trình cũng giới thiệu các tiết mục nghệ
            thuật truyền thống đan xen hiện đại như múa dân gian các nước,
            biểu diễn nhạc cụ dân tộc, K-Pop cover, Yosakoi; cùng với tiết mục
            hòa tấu hữu nghị và bế mạc.
          </p>
        </div>


        {/* ==================== THÔNG TIN NGÀY HỘI ==================== */}
        <div className="about-info-section">
          <div className="about-section-heading about-info-heading">
            <span className="about-section-icon">📅</span>

            <div>
              <h2 className="about-info-title">
                Thông tin Ngày hội
              </h2>
            </div>
          </div>

          <div className="about-info-grid">

            {/* THỜI GIAN */}
            <div className="about-info-item">
              <span>THỜI GIAN</span>

              <strong>
                08g00 - 16g00
                <br />
                ngày 26/10/2026 (thứ Hai)
              </strong>
            </div>


            {/* ĐỊA ĐIỂM */}
            <div className="about-info-item about-info-location">
              <span>ĐỊA ĐIỂM</span>

              <strong>
                Cơ sở 280 An Dương Vương, Trường Đại học Sư phạm Thành phố Hồ Chí Minh
                <span className="about-address-note">
                  (Phường Chợ Quán, Thành phố Hồ Chí Minh)
                </span>
              </strong>

              <div className="about-location-list">
                <p>
                  <b>Hội trường B:</b> Biểu diễn trang phục và không gian giao
                  lưu âm nhạc.
                </p>

                <p>
                  <b>Khu tự học Nhà B:</b> Gian hàng giới thiệu văn hóa và
                  không gian trải nghiệm ẩm thực các quốc gia.
                </p>

                <p>
                  <b>Sân nhà C:</b> Tổ chức không gian trải nghiệm với gian hàng
                  giới thiệu văn hóa 07 quốc gia.
                </p>
              </div>
            </div>


            {/* ĐỐI TƯỢNG */}
            <div className="about-info-item about-info-audience">
              <span>ĐỐI TƯỢNG</span>

              <ul>
                <li>
                  Đại diện cơ quan ngoại giao, trung tâm văn hóa, chuyên gia,
                  nghệ sĩ và khách mời trong nước, quốc tế.
                </li>

                <li>
                  Các ban/nhóm nhạc, câu lạc bộ, đội nhóm nghệ thuật tham gia
                  chương trình.
                </li>

                <li>
                  Viên chức, người lao động của Trường.
                </li>

                <li>
                  Học sinh, sinh viên, học viên sau đại học, lưu học sinh và
                  sinh viên trao đổi quốc tế đang học tập tại Trường.
                </li>
              </ul>
            </div>

          </div>
        </div>


        {/* ==================== CLOSING ==================== */}
        <div className="about-closing">
          <span>HCMUE · 50 NĂM</span>

          <h2>
            Ngày hội Giao lưu Văn hóa Quốc tế
          </h2>

          <p>
            Cùng khám phá, trải nghiệm và kết nối những sắc màu văn hóa tại
            Ngày hội giao lưu văn hóa quốc tế.
          </p>
        </div>

      </div>
    </section>
  );
}