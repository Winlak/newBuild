<template>
  <section class="contacts-block">
    <div class="container">
      <div class="contacts-block__grid">
        <div class="contacts-block__info">
          <ContactInfoCard />
        </div>

        <div id="contact-request" class="contacts-block__request">
          <ContactRequestCard />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contacts-block {
  position: relative;
  z-index: 3;
  box-sizing: border-box;
  margin-top: -78px;
  padding: 0 0 88px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0) 0, #f7faff 150px, #fff 100%);
}

.contacts-block *,
.contacts-block *::before,
.contacts-block *::after {
  box-sizing: border-box;
}

.contacts-block__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 28px;
  align-items: start;
  max-width: 1320px;
  margin: 0 auto;
}

.contacts-block__request {
  position: sticky;
  top: 96px;
  min-width: 0;
}

.contacts-block__info {
  min-width: 0;
}

@media (max-width: 1199.98px) {
  .contacts-block {
    margin-top: -54px;
  }

  .contacts-block__grid {
    grid-template-columns: 1fr;
    max-width: 820px;
  }

  .contacts-block__request {
    position: static;
  }
}

@media (max-width: 575.98px) {
  .contacts-block {
    margin-top: 0;
    padding: 24px 0 56px;
  }

  .contacts-block :deep(.container) {
    width: auto;
    max-width: none;
    margin-right: 12px;
    margin-left: 12px;
    padding-right: 0;
    padding-left: 0;
  }

  .contacts-block__grid {
    gap: 18px;
  }
}
</style>
