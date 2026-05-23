<template>
  <div class="dashboard-container">
    <!-- الهيدر الترحيبي -->
    <div class="welcome-section">
      <h1>لوحة التحكم الإحصائية</h1>
      <p>مرحباً بك في نظام إدارة مطعم الراكوبة الرقمي</p>
    </div>

    <!-- بطاقات الإحصائيات السريعة -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="card-icon">📁</div>
        <div class="card-info">
          <h3>الأقسام الحالية</h3>
          <p class="card-number">12</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="card-icon">🍔</div>
        <div class="card-info">
          <h3>إجمالي المنتجات</h3>
          <p class="card-number">84</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="card-icon">📲</div>
        <div class="card-info">
          <h3>مسحات الباركود (اليوم)</h3>
          <p class="card-number">342</p>
        </div>
      </div>

      <div class="stat-card sync-status">
        <div class="card-icon">🔄</div>
        <div class="card-info">
          <h3>حالة مزامنة VB.NET</h3>
          <p class="status-badge">نشط ومستقر</p>
        </div>
      </div>
    </div>

    <!-- رسالة توضيحية عن طبيعة المنيو -->
    <div class="info-notice">
      <p>
        💡 <strong>ملاحظة النظام:</strong> تم ضبط قائمة الطعام للزبائن عبر الرابط العام لتكون
        <span>للعرض فقط</span> بناءً على التهيئة الأخيرة.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
}
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  direction: rtl;
}

.welcome-section h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.welcome-section p {
  color: #666;
  font-size: 16px;
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.card-icon {
  font-size: 32px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
}

.card-info h3 {
  font-size: 14px;
  color: #888;
  margin: 0 0 4px 0;
}

.card-number {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.status-badge {
  font-size: 14px;
  font-weight: 600;
  color: #27ae60;
  margin: 0;
  background: #e8f8f0;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.info-notice {
  background: #e8f4fd;
  border-right: 4px solid #3498db;
  padding: 16px;
  border-radius: 4px;
  color: #2c3e50;
}

.info-notice span {
  font-weight: bold;
  color: #e74c3c;
}
</style>
