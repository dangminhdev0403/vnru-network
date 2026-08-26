(function(){
  if(window.__vnruV3Init) return;
  window.__vnruV3Init = true;

  const screens = [
    { area: "public", role: null, label: "Trang chủ Public", path: "public/index.html" },
    { area: "public", role: null, label: "Tìm kiếm tri thức", path: "public/search/index.html" },
    { area: "public", role: null, label: "Kho tri thức khoa học", path: "public/knowledge/index.html" },
    { area: "public", role: null, label: "Danh bạ chuyên gia Việt - Nga", path: "public/experts/index.html" },
    { area: "public", role: null, label: "Hồ sơ chuyên gia", path: "public/experts/detail.html" },
    { area: "auth", role: null, label: "Đăng nhập & Chọn vai trò", path: "auth/login.html" },
    { area: "workspace", role: "researcher", label: "Tổng quan nghiên cứu", path: "workspace/researcher/index.html" },
    { area: "workspace", role: "researcher", label: "Cộng tác nghiên cứu", path: "workspace/researcher/collaboration/index.html" },
    { area: "workspace", role: "researcher", label: "Đề xuất song phương (Co-PI)", path: "workspace/researcher/proposals/detail.html" },
    { area: "workspace", role: "researcher", label: "Dự án song phương đang chạy", path: "workspace/researcher/projects/detail.html" },
    { area: "workspace", role: "researcher", label: "Học thuật & Trao đổi", path: "workspace/researcher/academic/index.html" },
    { area: "workspace", role: "researcher", label: "Chi tiết hoạt động học thuật", path: "workspace/researcher/academic/activity-detail.html" },
    { area: "workspace", role: "researcher", label: "Tri thức cá nhân", path: "workspace/researcher/knowledge.html" },
    { area: "workspace", role: "reviewer", label: "Hàng đợi phản biện", path: "workspace/reviewer/index.html" },
    { area: "workspace", role: "reviewer", label: "Đánh giá ẩn danh (Rubric)", path: "workspace/reviewer/review-detail.html" },
    { area: "workspace", role: "organization", label: "Tổng quan tổ chức (VAST/HUST)", path: "workspace/organization/index.html" },
    { area: "workspace", role: "organization", label: "Xác nhận đề xuất (Endorsements)", path: "workspace/organization/endorsements.html" },
    { area: "workspace", role: "organization", label: "Quản lý hoạt động học thuật", path: "workspace/organization/academic/index.html" },
    { area: "workspace", role: "organization", label: "Chi tiết hoạt động tổ chức", path: "workspace/organization/academic/activity-detail.html" },
    { area: "workspace", role: "enterprise", label: "Nhu cầu công nghệ doanh nghiệp", path: "workspace/enterprise/index.html" },
    { area: "workspace", role: "enterprise", label: "Khám phá công nghệ sẵn sàng", path: "workspace/enterprise/technology/index.html" },
    { area: "workspace", role: "enterprise", label: "Chi tiết công nghệ & Quan tâm", path: "workspace/enterprise/technology/detail.html" },
    { area: "workspace", role: "enterprise", label: "Ghép liên danh 2+2 (Consortium)", path: "workspace/enterprise/consortium/2plus2.html" },
    { area: "workspace", role: "leadership", label: "Tổng quan phân tích chiến lược", path: "workspace/leadership/index.html" },
    { area: "workspace", role: "leadership", label: "Báo cáo phân tích chuyên sâu", path: "workspace/leadership/reports.html" },
    { area: "governance", role: "governance", label: "Tổng quan quản trị hệ thống", path: "governance/index.html" },
    { area: "governance", role: "governance", label: "Quản lý Danh tính & Phân quyền", path: "governance/access/index.html" },
    { area: "governance", role: "governance", label: "Kiểm duyệt & Quy trình", path: "governance/workflow/index.html" },
    { area: "governance", role: "governance", label: "Nhật ký bảo mật & Audit", path: "governance/audit/index.html" }
  ];

  const flows = {
    researcher: [
      { n: "1", label: "Tổng quan", path: "workspace/researcher/index.html", interaction: "Việc cần xử lý & KPI" },
      { n: "2", label: "Cộng tác nghiên cứu", path: "workspace/researcher/collaboration/index.html", interaction: "Tìm cơ hội & Co-PI" },
      { n: "3", label: "Đề xuất song phương", path: "workspace/researcher/proposals/detail.html", interaction: "Đồng tác giả & Nộp hồ sơ" },
      { n: "4", label: "Dự án đang chạy", path: "workspace/researcher/projects/detail.html", interaction: "Theo dõi milestone & Giao phẩm" },
      { n: "5", label: "Học thuật & Trao đổi", path: "workspace/researcher/academic/index.html", interaction: "Hội thảo & Đoàn công tác" }
    ],
    reviewer: [
      { n: "1", label: "Hàng đợi phản biện", path: "workspace/reviewer/index.html", interaction: "Hồ sơ được phân công" },
      { n: "2", label: "Đánh giá ẩn danh", path: "workspace/reviewer/review-detail.html", interaction: "Chấm điểm Rubric & Nhận xét" },
      { n: "3", label: "Hoàn tất phản biện", path: "workspace/reviewer/index.html", interaction: "Theo dõi hồ sơ đã nộp" }
    ],
    organization: [
      { n: "1", label: "Tổng quan tổ chức", path: "workspace/organization/index.html", interaction: "Năng lực & Nhà khoa học" },
      { n: "2", label: "Xác nhận đề xuất", path: "workspace/organization/endorsements.html", interaction: "Cam kết nguồn lực & Đóng dấu" },
      { n: "3", label: "Hoạt động học thuật", path: "workspace/organization/academic/index.html", interaction: "Điều phối đoàn trao đổi" }
    ],
    enterprise: [
      { n: "1", label: "Nhu cầu doanh nghiệp", path: "workspace/enterprise/index.html", interaction: "Đăng ký bài toán thực tiễn" },
      { n: "2", label: "Khám phá công nghệ", path: "workspace/enterprise/technology/index.html", interaction: "Tìm công nghệ TRL 5-7" },
      { n: "3", label: "Bày tỏ quan tâm", path: "workspace/enterprise/technology/detail.html", interaction: "Gửi đề xuất tiếp nhận" },
      { n: "4", label: "Liên danh 2+2", path: "workspace/enterprise/consortium/2plus2.html", interaction: "Hoàn thiện 4 đối tác 2+2" }
    ],
    leadership: [
      { n: "1", label: "Tổng quan phân tích", path: "workspace/leadership/index.html", interaction: "Tín hiệu & Xu hướng Việt - Nga" },
      { n: "2", label: "Bản đồ hợp tác", path: "workspace/leadership/index.html", interaction: "Phân bố theo lĩnh vực & viện" },
      { n: "3", label: "Báo cáo chiến lược", path: "workspace/leadership/reports.html", interaction: "Trích xuất báo cáo nội bộ" }
    ]
  };

  const roleHomes = {
    researcher: "workspace/researcher/index.html",
    reviewer: "workspace/reviewer/index.html",
    organization: "workspace/organization/index.html",
    enterprise: "workspace/enterprise/index.html",
    leadership: "workspace/leadership/index.html"
  };

  const body = document.body;
  const area = body.dataset.area || 'demo';
  const role = body.dataset.role || null;
  const current = body.dataset.screen || 'index.html';
  const depth = (current.match(/\//g) || []).length;
  const rootPrefix = '../'.repeat(depth);
  const to = (p) => rootPrefix + p;

  function esc(s) {
    return String(s).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));
  }

  // Toast System
  const toastStack = document.createElement('div');
  toastStack.className = 'toast-stack';
  document.body.appendChild(toastStack);

  function toast(title, msg = 'Thao tác tương tác mô phỏng trên prototype.') {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span class="toast-dot"></span><div><strong>${esc(title)}</strong><small>${esc(msg)}</small></div>`;
    toastStack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 220);
    }, 2800);
  }
  window.showToast = toast;

  // Modal Dialog Engine
  function openModal({ title, content, actions = [], size = '' }) {
    document.querySelector('.modal-backdrop')?.remove();
    const back = document.createElement('div');
    back.className = 'modal-backdrop';
    
    let actionButtonsHtml = actions.map(act => {
      const cls = act.type === 'primary' ? 'primary-btn' : act.type === 'danger' ? 'danger-btn' : 'secondary-btn';
      return `<button type="button" class="${cls}" data-modal-act="${esc(act.id)}">${esc(act.label)}</button>`;
    }).join('');

    if (!actionButtonsHtml) {
      actionButtonsHtml = '<button type="button" class="secondary-btn" data-modal-act="close">Đóng</button>';
    }

    back.innerHTML = `
      <div class="modal ${size ? 'modal-' + size : ''}" role="dialog" aria-modal="true">
        <div class="modal-head">
          <h3>${esc(title)}</h3>
          <button type="button" class="modal-close-btn" aria-label="Đóng">&times;</button>
        </div>
        <div class="modal-body">${content}</div>
        <div class="modal-foot">${actionButtonsHtml}</div>
      </div>
    `;

    document.body.appendChild(back);

    const close = () => {
      back.style.opacity = '0';
      setTimeout(() => back.remove(), 160);
    };

    back.querySelector('.modal-close-btn')?.addEventListener('click', close);
    back.addEventListener('click', (e) => {
      if (e.target === back) close();
    });

    actions.forEach(act => {
      back.querySelector(`[data-modal-act="${act.id}"]`)?.addEventListener('click', () => {
        if (act.onClick) {
          act.onClick({ close, back });
        } else {
          close();
        }
      });
    });

    back.querySelector('[data-modal-act="close"]')?.addEventListener('click', close);
  }
  window.openModal = openModal;

  // Drawer Engine
  function openDrawer({ title, content, actions = [] }) {
    document.querySelector('.detail-drawer-backdrop')?.remove();
    document.querySelector('.detail-drawer')?.remove();

    const back = document.createElement('div');
    back.className = 'modal-backdrop detail-drawer-backdrop';
    
    const drawer = document.createElement('div');
    drawer.className = 'detail-drawer';
    
    let actionsHtml = actions.map(act => {
      const cls = act.type === 'primary' ? 'primary-btn' : 'secondary-btn';
      return `<button type="button" class="${cls}" data-drawer-act="${esc(act.id)}">${esc(act.label)}</button>`;
    }).join('');

    drawer.innerHTML = `
      <div class="drawer-head">
        <h3>${esc(title)}</h3>
        <button type="button" class="modal-close-btn" aria-label="Đóng">&times;</button>
      </div>
      <div class="drawer-body">${content}</div>
      <div class="drawer-foot">${actionsHtml || '<button type="button" class="secondary-btn" data-drawer-act="close">Đóng</button>'}</div>
    `;

    document.body.appendChild(back);
    document.body.appendChild(drawer);

    const close = () => {
      back.remove();
      drawer.remove();
    };

    drawer.querySelector('.modal-close-btn')?.addEventListener('click', close);
    back.addEventListener('click', close);

    actions.forEach(act => {
      drawer.querySelector(`[data-drawer-act="${act.id}"]`)?.addEventListener('click', () => {
        if (act.onClick) act.onClick({ close, drawer });
        else close();
      });
    });
    drawer.querySelector('[data-drawer-act="close"]')?.addEventListener('click', close);
  }
  window.openDrawer = openDrawer;

  // Enhance Side Navigation Icons
  const iconMap = {
    'Tổng quan': '⌂',
    'Tổng quan nghiên cứu': '⌂',
    'Tổng quan phản biện': '✓',
    'Tổng quan tổ chức': '▦',
    'Tổng quan doanh nghiệp': '▦',
    'Tổng quan phân tích': '⌁',
    'Tri thức của tôi': '◉',
    'Cộng tác nghiên cứu': '⇄',
    'Dự án của tôi': '◇',
    'Dự án đang chạy': '◇',
    'Học thuật & Trao đổi': '◫',
    'Hồ sơ đang đánh giá': '✓',
    'Hàng đợi phản biện': '✓',
    'Đánh giá ẩn danh': '✎',
    'Xác nhận đề xuất': '✎',
    'Hoạt động học thuật': '◫',
    'Khám phá công nghệ': '⬡',
    'Công nghệ quan tâm': '⬢',
    'Liên danh 2+2': '✦',
    'Trung tâm báo cáo': '▤',
    'Báo cáo chiến lược': '▤',
    'Danh tính & Phân quyền': '◎',
    'Danh tính & Truy cập': '◎',
    'Kiểm duyệt & Quy trình': '⇄',
    'Quy trình & Kiểm duyệt': '⇄',
    'Audit & Security': '◈',
    'Nhật ký bảo mật': '◈'
  };

  document.querySelectorAll('.side-link').forEach(a => {
    const text = (a.textContent || '').trim();
    const dot = a.querySelector('.dot');
    if (dot && !a.querySelector('.nav-glyph')) {
      const g = document.createElement('span');
      g.className = 'nav-glyph';
      g.textContent = iconMap[text] || '•';
      dot.insertAdjacentElement('afterend', g);
    }
  });

  // Role Switcher Navigation
  const chip = document.querySelector('.context-chip');
  if (chip && area === 'workspace') {
    chip.setAttribute('role', 'button');
    chip.tabIndex = 0;
    chip.title = 'Chuyển đổi vai trò làm việc';

    const openRoleSwitcher = () => {
      document.querySelector('.role-switcher-pop')?.remove();
      const r = chip.getBoundingClientRect();
      const pop = document.createElement('div');
      pop.className = 'role-switcher-pop';
      pop.style.top = Math.min(innerHeight - 340, r.bottom + 8) + 'px';
      pop.style.left = Math.max(12, Math.min(innerWidth - 352, r.right - 340)) + 'px';

      [
        ['researcher', 'Nhà nghiên cứu', 'Đề xuất · Dự án · Học thuật song phương'],
        ['reviewer', 'Hội đồng phản biện', 'Đánh giá ẩn danh & Chấm điểm Rubric'],
        ['organization', 'Đại diện tổ chức', 'VAST / HUST / Viện Hàn lâm — Xác nhận đề xuất'],
        ['enterprise', 'Đại diện doanh nghiệp', 'Nhu cầu công nghệ · Khám phá & Liên danh 2+2'],
        ['leadership', 'Lãnh đạo chiến lược', 'Phân tích xu hướng & Trích xuất báo cáo']
      ].forEach(([key, name, sub]) => {
        const b = document.createElement('button');
        b.innerHTML = `<strong>${name}</strong><small>${sub}</small>`;
        b.addEventListener('click', () => {
          location.href = to(roleHomes[key]);
        });
        pop.appendChild(b);
      });

      document.body.appendChild(pop);
      setTimeout(() => {
        document.addEventListener('click', function close(e) {
          if (!pop.contains(e.target) && e.target !== chip) {
            pop.remove();
            document.removeEventListener('click', close);
          }
        });
      }, 0);
    };

    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      openRoleSwitcher();
    });
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRoleSwitcher();
      }
    });
  }

  // Interactive Tab Engine
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.tab-bar');
      if (!parent) return;
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.tabTarget;
      if (target) {
        document.querySelectorAll('[data-tab-content]').forEach(content => {
          content.style.display = (content.dataset.tabContent === target || target === 'all') ? '' : 'none';
        });
      }
      toast('Chuyển tab dữ liệu', btn.textContent.trim());
    });
  });

  // Dynamic Rubric Scoring for Reviewer
  function updateRubricScore() {
    const sliders = document.querySelectorAll('.score-slider');
    if (sliders.length === 0) return;
    
    let total = 0;
    let max = 0;
    sliders.forEach(slider => {
      const val = parseFloat(slider.value) || 0;
      const weight = parseFloat(slider.dataset.weight) || 1;
      total += val * weight;
      max += 10 * weight;
      
      const out = document.querySelector(`[data-score-out="${slider.id}"]`);
      if (out) out.textContent = val + '/10';
    });

    const totalEl = document.querySelector('#rubricTotalScore');
    const badgeEl = document.querySelector('#rubricGradeBadge');
    if (totalEl) totalEl.textContent = total.toFixed(1) + ' / ' + max;
    
    if (badgeEl) {
      const ratio = total / max;
      if (ratio >= 0.85) {
        badgeEl.className = 'badge green';
        badgeEl.textContent = 'Khuyến nghị duyệt (Xuất sắc)';
      } else if (ratio >= 0.70) {
        badgeEl.className = 'badge amber';
        badgeEl.textContent = 'Đạt yêu cầu (Cần chỉnh sửa nhỏ)';
      } else {
        badgeEl.className = 'badge red';
        badgeEl.textContent = 'Không khuyến nghị (Chưa đạt)';
      }
    }
  }

  document.querySelectorAll('.score-slider').forEach(slider => {
    slider.addEventListener('input', updateRubricScore);
  });
  updateRubricScore();

  // 2+2 Consortium Interactive Slot Selector
  const partnersCatalog = {
    'vn-inst': [
      { name: 'Viện Hàn lâm KH & CN Việt Nam (VAST)', dept: 'Viện Hải dương học Nha Trang', lead: 'GS.TS. Trần Đình Nam' },
      { name: 'Đại học Quốc gia Hà Nội (VNU)', dept: 'Khoa Vật liệu & Công nghệ Nano', lead: 'PGS.TS. Lê Hoài Thanh' },
      { name: 'Trung tâm Nhiệt đới Việt – Nga', dept: 'Phòng Y sinh Nhiệt đới', lead: 'TS. Vũ Hoàng Long' }
    ],
    'vn-ent': [
      { name: 'Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel R&D)', dept: 'Viện Nghiên cứu Công nghệ cao', lead: 'KS. Nguyễn Văn Hùng' },
      { name: 'Công ty CP Công nghệ Sinh học Vinabiom', dept: 'Bộ phận R&D Ứng dụng', lead: 'ThS. Phạm Thị Mai' },
      { name: 'Tập đoàn Điện lực Việt Nam (EVN R&D)', dept: 'Trung tâm Lưới điện Thông minh', lead: 'TS. Đặng Quốc Bảo' }
    ],
    'ru-inst': [
      { name: 'Viện Hàn lâm Khoa học LB Nga (FEB RAS)', dept: 'Viện Sinh học Biển Vladivostok', lead: 'Prof. Alexei Morozov' },
      { name: 'Đại học Quốc gia Nghiên cứu MISIS Moskva', dept: 'Khoa Vật liệu Bán dẫn & Composite', lead: 'Prof. Dmitry Sokolov' },
      { name: 'Viện Nghiên cứu Dịch tễ Gamaleya', dept: 'Phòng Thử nghiệm Kháng thể', lead: 'Dr. Elena Petrova' }
    ],
    'ru-ent': [
      { name: 'Rostec High-Tech Materials Group', dept: 'Ban Hợp tác Công nghệ Quốc tế', lead: 'Eng. Igor Volkov' },
      { name: 'Biocad Pharmaceuticals St. Petersburg', dept: 'Trung tâm Chuyển giao Y sinh', lead: 'Dr. Svetlana Ivanova' },
      { name: 'Rosseti Smart Grid Technologies', dept: 'Khối Phát triển Thiết bị Lưới', lead: 'Eng. Mikhail Popov' }
    ]
  };

  document.querySelectorAll('.slot[data-slot-type]').forEach(slot => {
    slot.addEventListener('click', () => {
      const type = slot.dataset.slotType;
      const typeName = slot.querySelector('small')?.textContent || 'Vị trí liên danh';
      const currentName = slot.querySelector('strong')?.textContent || '';
      const list = partnersCatalog[type] || [];

      let html = `<p class="muted tiny">Chọn đơn vị đáp ứng tiêu chuẩn tham gia Liên danh 2+2 (${esc(typeName)}):</p><div class="list" style="margin-top:14px">`;
      list.forEach((p, idx) => {
        html += `
          <div class="row" style="padding:10px;border:1px solid #e0e6ec;border-radius:10px;margin-bottom:8px;cursor:pointer" data-partner-idx="${idx}">
            <div class="row-main">
              <strong>${esc(p.name)}</strong>
              <span class="muted tiny">${esc(p.dept)} · Trưởng nhóm: ${esc(p.lead)}</span>
            </div>
            <button type="button" class="primary-btn btn-sm">Chọn đơn vị</button>
          </div>
        `;
      });
      html += `</div>`;

      openModal({
        title: `Phân công vị trí: ${typeName}`,
        content: html,
        actions: [
          { id: 'cancel', label: 'Hủy', type: 'secondary' }
        ]
      });

      setTimeout(() => {
        document.querySelectorAll('[data-partner-idx]').forEach(item => {
          item.addEventListener('click', () => {
            const partner = list[item.dataset.partnerIdx];
            if (partner) {
              slot.className = 'slot filled';
              const strong = slot.querySelector('strong');
              if (strong) strong.textContent = partner.name;
              const meta = slot.querySelector('.slot-meta') || slot.querySelector('span.muted');
              if (meta) meta.textContent = `${partner.dept} · Phụ trách: ${partner.lead}`;
              
              const badge = slot.querySelector('.slot-status');
              if (badge) {
                badge.className = 'slot-status badge green';
                badge.textContent = 'Đã ghép đối tác';
              }
              
              toast('Đã cập nhật đối tác 2+2', partner.name);
              document.querySelector('.modal-backdrop')?.remove();
            }
          });
        });
      }, 50);
    });
  });

  // Action Dispatcher for Buttons
  document.querySelectorAll('[data-local-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.localAction;

      // 1. Submit Review
      if (action === 'submit-review') {
        openModal({
          title: 'Xác nhận nộp đánh giá phản biện',
          content: `
            <p>Bạn sắp nộp bản nhận xét & điểm số phản biện cho đề xuất song phương mã số <strong>#RU-VN-2026-BIO-08</strong>.</p>
            <div class="notice" style="margin-top:12px">
              <strong>Quy chuẩn bảo mật ẩn danh:</strong> Điểm số và nhận xét sẽ được tổng hợp độc lập, không tiết lộ danh tính chuyên gia phản biện.
            </div>
          `,
          actions: [
            {
              id: 'confirm',
              label: 'Nộp phản biện ngay',
              type: 'primary',
              onClick: ({ close }) => {
                const st = document.querySelector('[data-review-state]');
                if (st) {
                  st.textContent = 'Đã hoàn tất đánh giá';
                  st.dataset.state = 'done';
                  st.className = 'badge green';
                }
                toast('Đã nộp phản biện thành công', 'Trạng thái chuyển sang Đã đánh giá.');
                close();
              }
            },
            { id: 'cancel', label: 'Quay lại xem lại', type: 'secondary' }
          ]
        });
        return;
      }

      // 2. Organization Endorsement
      if (action === 'endorse') {
        const row = btn.closest('[data-endorsement]');
        const title = row?.querySelector('strong')?.textContent || 'Đề xuất song phương';
        openModal({
          title: 'Xác nhận tư cách đơn vị chủ trì (Institutional Endorsement)',
          content: `
            <p>Xác nhận tổ chức <strong>Viện Hàn lâm KH & CN Việt Nam (VAST)</strong> bảo trợ cơ sở vật chất và chấp thuận cho chủ nhiệm đề tài tham gia đề xuất:</p>
            <blockquote style="border-left:3px solid var(--blue);padding-left:12px;margin:12px 0;font-style:italic;color:#334a64">
              "${esc(title)}"
            </blockquote>
            <div class="successbox">
              ✓ Đã đối soát nhân sự chính ngạch và không có xung đột lợi ích.<br/>
              ✓ Sẵn sàng cung cấp phòng thí nghiệm trọng điểm và hạ tầng đo kiểm.
            </div>
          `,
          actions: [
            {
              id: 'confirm-endorse',
              label: 'Ký & Đóng dấu xác nhận',
              type: 'primary',
              onClick: ({ close }) => {
                const badge = row?.querySelector('.badge');
                if (badge) {
                  badge.textContent = 'Đã xác nhận (Endorsed)';
                  badge.className = 'badge green';
                }
                btn.style.display = 'none';
                toast('Đã cấp xác nhận bảo trợ tổ chức', title);
                close();
              }
            },
            { id: 'cancel', label: 'Hủy', type: 'secondary' }
          ]
        });
        return;
      }

      // 3. Co-PI Invitation
      if (action === 'invite-copi') {
        openModal({
          title: 'Gửi lời mời đồng chủ nhiệm (Co-PI) phía Nga',
          content: `
            <div class="list">
              <label class="tiny" style="font-weight:700">Chọn nhà khoa học phía Nga:</label>
              <select class="field" style="width:100%;margin:6px 0 12px">
                <option>GS.TS. Alexei Morozov (Viện Sinh học Biển FEB RAS)</option>
                <option>PGS.TS. Dmitry Sokolov (MISIS Moskva)</option>
                <option>TS. Elena Petrova (Viện Gamaleya)</option>
              </select>
              <label class="tiny" style="font-weight:700">Lời nhắn / Phân công trách nhiệm dự kiến:</label>
              <textarea class="field" style="width:100%;height:80px;margin-top:6px" placeholder="Trân trọng kính mời Giáo sư tham gia đồng chủ nhiệm đề xuất nghiên cứu song phương Việt - Nga..."></textarea>
            </div>
          `,
          actions: [
            {
              id: 'send',
              label: 'Gửi lời mời',
              type: 'primary',
              onClick: ({ close }) => {
                toast('Đã gửi lời mời Co-PI', 'Thông báo đã chuyển tới GS. Alexei Morozov.');
                close();
              }
            },
            { id: 'cancel', label: 'Hủy', type: 'secondary' }
          ]
        });
        return;
      }

      // 4. Expression of Interest (Enterprise)
      if (action === 'express-interest') {
        openModal({
          title: 'Bày tỏ quan tâm tiếp nhận công nghệ',
          content: `
            <p>Gửi phiếu yêu cầu trao đổi sâu về công nghệ <strong>Vật liệu Nano Composite Chống Ăn Mòn Biển</strong> tới nhóm tác giả VAST & MISIS:</p>
            <div class="list" style="margin-top:12px">
              <label class="tiny" style="font-weight:700">Nhu cầu ứng dụng tại doanh nghiệp:</label>
              <textarea class="field" style="width:100%;height:80px;margin-top:4px" placeholder="Doanh nghiệp chúng tôi muốn thử nghiệm vật liệu này trên kết cấu giàn khoan và vỏ tàu ven biển..."></textarea>
            </div>
          `,
          actions: [
            {
              id: 'send-interest',
              label: 'Gửi yêu cầu kết nối',
              type: 'primary',
              onClick: ({ close }) => {
                toast('Đã gửi bày tỏ quan tâm', 'Nhóm nghiên cứu và Ban Chuyển giao sẽ nhận được thông báo.');
                close();
              }
            },
            { id: 'cancel', label: 'Hủy', type: 'secondary' }
          ]
        });
        return;
      }

      // 5. Strategic Report Preview / Export (Leadership)
      if (action === 'report-preview') {
        openModal({
          title: 'Báo cáo Chiến lược Hợp tác Khoa học Việt – Nga 2026',
          size: 'lg',
          content: `
            <div style="background:#fff;padding:16px;border:1px solid #d8e2ec;border-radius:8px">
              <div style="text-align:center;border-bottom:1px solid #e0e6ec;padding-bottom:12px;margin-bottom:14px">
                <span class="eyebrow">Ủy ban Hợp tác Khoa học & Công nghệ Việt Nam – Liên bang Nga</span>
                <h2 style="font-family:var(--serif);font-size:22px;margin:6px 0">BÁO CÁO PHÂN TÍCH TỔNG QUAN TÍN HIỆU NGHIÊN CỨU</h2>
                <small class="muted">Kỳ báo cáo: Quý I/2026 · Phân tích bởi VN-RU Knowledge Engine</small>
              </div>
              <div class="grid g3">
                <div class="card flat" style="border:1px solid #e0e6ec;padding:12px">
                  <small class="muted">Đề xuất đang xử lý</small>
                  <strong style="font-size:22px;display:block;margin-top:4px">48 hồ sơ</strong>
                </div>
                <div class="card flat" style="border:1px solid #e0e6ec;padding:12px">
                  <small class="muted">Công bố đồng tác giả</small>
                  <strong style="font-size:22px;display:block;margin-top:4px">142 bài ISI/Scopus</strong>
                </div>
                <div class="card flat" style="border:1px solid #e0e6ec;padding:12px">
                  <small class="muted">Liên danh 2+2 sẵn sàng</small>
                  <strong style="font-size:22px;display:block;margin-top:4px">12 liên danh</strong>
                </div>
              </div>
              <p style="font-size:13px;line-height:1.6;margin-top:14px;color:#334a64">
                <strong>Nhận định chiến lược:</strong> Tỉ trọng nghiên cứu trong lĩnh vực Khoa học Biển & Hải dương học và Vật liệu tiên tiến tiếp tục dẫn đầu về số lượng kết nối thực chất. Cần tiếp tục thúc đẩy cơ chế liên danh 2+2 để gia tăng tỉ lệ thương mại hóa công nghệ sau phòng thí nghiệm.
              </p>
            </div>
          `,
          actions: [
            {
              id: 'print',
              label: 'In / Xuất PDF',
              type: 'primary',
              onClick: () => {
                toast('Đang chuẩn bị bản in PDF...', 'Báo cáo sẽ được xuất dưới định dạng chuẩn.');
              }
            },
            { id: 'close', label: 'Đóng', type: 'secondary' }
          ]
        });
        return;
      }

      // 6. User / Permission Modal (Governance)
      if (action === 'grant-permission') {
        openModal({
          title: 'Phân quyền tài khoản quản trị',
          content: `
            <div class="list">
              <label class="tiny" style="font-weight:700">Tên người dùng / Email:</label>
              <input class="field" style="width:100%;margin:4px 0 10px" value="nguyen.vana@vast.vn" readonly />
              <label class="tiny" style="font-weight:700">Gán vai trò (Role):</label>
              <select class="field" style="width:100%;margin:4px 0 10px">
                <option selected>RESEARCHER (Nhà nghiên cứu)</option>
                <option>REVIEWER (Hội đồng phản biện)</option>
                <option>ORGANIZATION_REP (Đại diện tổ chức)</option>
                <option>ENTERPRISE_REP (Đại diện doanh nghiệp)</option>
                <option>LEADERSHIP_VIEWER (Lãnh đạo xem phân tích)</option>
              </select>
            </div>
          `,
          actions: [
            {
              id: 'save-role',
              label: 'Lưu phân quyền',
              type: 'primary',
              onClick: ({ close }) => {
                toast('Đã cập nhật phân quyền', 'Quyền hạn có hiệu lực ngay trong phiên làm việc.');
                close();
              }
            },
            { id: 'cancel', label: 'Hủy', type: 'secondary' }
          ]
        });
        return;
      }

      // Default Draft / Demo
      if (action === 'draft') {
        toast('Đã lưu nháp hồ sơ', 'Bản thảo đã được lưu vào bộ nhớ tạm local.');
        return;
      }

      toast('Thao tác tương tác', btn.textContent.trim());
    });
  });

  // Client-side Instant Filter for Lists & Tables
  document.querySelectorAll('input[data-filter-input], input[placeholder*="Tìm"], input[placeholder*="tìm"]').forEach(input => {
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      const candidates = [...document.querySelectorAll('article.card, .row, .slot, .task-card, .table tbody tr')].filter(x => !x.contains(input));
      if (candidates.length < 2) return;
      candidates.forEach(el => {
        el.style.display = (!q || el.textContent.toLowerCase().includes(q)) ? '' : 'none';
      });
    });
  });

  // Stepper Wizard Interactive Click
  document.querySelectorAll('.step').forEach((step, i, all) => {
    step.addEventListener('click', () => {
      all.forEach((s, j) => {
        s.classList.toggle('done', j < i);
        s.classList.toggle('active', j === i);
      });
      toast('Đã chuyển bước quy trình', step.textContent.trim());
    });
  });

  // Scoped Command Palette (Ctrl+K)
  function openPalette() {
    if (document.querySelector('.modal-backdrop')) return;
    const back = document.createElement('div');
    back.className = 'modal-backdrop';
    back.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" style="max-width:620px">
        <div class="modal-head">
          <span style="font-size:16px;color:var(--muted)">⌕</span>
          <input autofocus placeholder="Tìm kiếm nhanh trong phạm vi vai trò hiện tại..." aria-label="Tìm màn hình" style="border:0;outline:0;flex:1;background:transparent;font-size:15px;color:var(--ink)">
          <span class="kbd">ESC</span>
        </div>
        <div class="command-list"></div>
      </div>
    `;
    document.body.appendChild(back);

    const input = back.querySelector('input');
    const list = back.querySelector('.command-list');
    
    let pool = screens.filter(s => {
      if (area === 'workspace') return s.area === 'workspace' && s.role === role;
      if (area === 'public') return s.area === 'public';
      if (area === 'governance') return s.area === 'governance';
      return true;
    });

    let active = 0;
    let filtered = [];

    const render = () => {
      const q = input.value.trim().toLowerCase();
      filtered = pool.filter(s => !q || s.label.toLowerCase().includes(q));
      list.innerHTML = '';
      if (filtered.length === 0) {
        list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--muted);font-size:13px">Không tìm thấy màn hình phù hợp</div>';
        return;
      }
      filtered.forEach((s, i) => {
        const el = document.createElement('div');
        el.className = 'command-item' + (i === active ? ' active' : '');
        el.innerHTML = `
          <span class="command-icon">→</span>
          <div>
            <strong>${esc(s.label)}</strong>
            <small>${esc(s.area)}${s.role ? ' · ' + esc(s.role) : ''}</small>
          </div>
        `;
        el.addEventListener('click', () => {
          location.href = to(s.path);
        });
        list.appendChild(el);
      });
    };

    render();

    input.addEventListener('input', () => {
      active = 0;
      render();
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        active = Math.min(active + 1, filtered.length - 1);
        render();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        active = Math.max(active - 1, 0);
        render();
      }
      if (e.key === 'Enter' && filtered[active]) {
        location.href = to(filtered[active].path);
      }
      if (e.key === 'Escape') {
        back.remove();
      }
    });

    back.addEventListener('click', e => {
      if (e.target === back) back.remove();
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openPalette();
    }
    if (e.key === 'Escape') {
      document.querySelector('.modal-backdrop')?.remove();
      document.querySelector('.role-switcher-pop')?.remove();
      document.querySelector('.flow-drawer')?.remove();
      document.querySelector('.detail-drawer')?.remove();
    }
  });

  // Flow Drawer
  function openFlow() {
    document.querySelector('.flow-drawer')?.remove();
    const d = document.createElement('div');
    d.className = 'flow-drawer';

    if (area === 'workspace' && role && flows[role]) {
      d.innerHTML = `
        <h3>Luồng làm việc: ${esc(role)}</h3>
        <p>Màn hình và tiến trình thuộc vai trò hiện tại.</p>
      `;
      flows[role].forEach(x => {
        const a = document.createElement('a');
        a.className = 'flow-link';
        a.href = to(x.path);
        a.innerHTML = `
          <span class="num">${esc(x.n)}</span>
          <span>
            <strong>${esc(x.label)}</strong>
            <small>${esc(x.interaction)}</small>
          </span>
        `;
        d.appendChild(a);
      });
    } else {
      d.innerHTML = `
        <h3>Sơ đồ truy cập phân quyền</h3>
        <p>Phân tách rõ ràng Public / Workspace theo vai trò / Governance.</p>
        <a class="flow-link" href="${to('demo/flow-map.html')}">
          <span class="num">☷</span>
          <span>
            <strong>Xem Role & Flow Map</strong>
            <small>Ma trận sở hữu màn hình toàn hệ thống</small>
          </span>
        </a>
      `;
    }

    document.body.appendChild(d);
    setTimeout(() => {
      document.addEventListener('click', function close(e) {
        if (!d.contains(e.target) && !e.target.closest('[data-demo-flow]')) {
          d.remove();
          document.removeEventListener('click', close);
        }
      });
    }, 0);
  }

  // Floating Demo Toolbar
  if (area !== 'demo') {
    const tb = document.createElement('div');
    tb.className = 'demo-toolbar';
    tb.innerHTML = `
      <button type="button" data-demo="palette">⌕ Tìm nhanh <span class="kbd">Ctrl K</span></button>
      <button type="button" data-demo-flow>⇄ Luồng vai trò</button>
      <button type="button" data-demo="map">☷ Sơ đồ phân quyền</button>
      <button type="button" data-demo="auth">👤 Đổi Role / Login</button>
    `;
    document.body.appendChild(tb);

    tb.querySelector('[data-demo="palette"]').addEventListener('click', openPalette);
    tb.querySelector('[data-demo-flow]').addEventListener('click', (e) => {
      e.stopPropagation();
      openFlow();
    });
    tb.querySelector('[data-demo="map"]').addEventListener('click', () => {
      location.href = to('demo/flow-map.html');
    });
    tb.querySelector('[data-demo="auth"]').addEventListener('click', () => {
      location.href = to('auth/login.html');
    });
  }

  const badge = document.createElement('div');
  badge.className = 'demo-badge';
  badge.textContent = area === 'workspace' ? `Role · ${role}` : area === 'governance' ? 'Khu vực Governance' : area === 'public' ? 'Khu vực Public' : 'Demo Control Center';
  document.body.appendChild(badge);
})();
