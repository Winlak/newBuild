<template>
  <section class="privacy-page">
    <div class="container">
      <div class="privacy-page__card">
        <NuxtLink to="/" class="privacy-page__back">
          Вернуться на главную
        </NuxtLink>

        <h1>Политика конфиденциальности</h1>

        <p>
          Мы используем данные из форм сайта только для связи по заявке,
          подбора новостроек и ответа на вопросы пользователя.
        </p>

        <h2>Какие данные обрабатываются</h2>
        <p>
          Имя, телефон, email, комментарий к заявке и технические данные,
          необходимые для работы сайта.
        </p>

        <h2>Как используются данные</h2>
        <p>
          Данные не публикуются и не передаются третьим лицам, кроме случаев,
          необходимых для обработки обращения или предусмотренных законом.
        </p>

        <h2>Контакты</h2>
        <p>
          По вопросам обработки персональных данных можно написать на
          <a href="mailto:info@nsk-novostroyki.ru">info@nsk-novostroyki.ru</a>.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
usePageSeo({
  title: 'Политика конфиденциальности',
  description: 'Политика обработки персональных данных сайта Новостройки НСК.',
  path: '/privacy',
})
</script>

<style scoped>
.privacy-page {
  padding: 128px 0 72px;
  background:
    radial-gradient(circle at 16% 14%, rgba(13, 110, 253, 0.1), transparent 28%),
    linear-gradient(180deg, #f7faff 0%, #fff 62%);
}

.privacy-page__card {
  max-width: 860px;
  margin: 0 auto;
  padding: 44px;
  border: 1px solid #e3ebf6;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 24px 70px rgba(14, 30, 62, 0.1);
}

.privacy-page__back {
  display: inline-flex;
  margin-bottom: 28px;
  color: #0d6efd;
  font-weight: 800;
  text-decoration: none;
}

.privacy-page h1,
.privacy-page h2 {
  color: #07123d;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.privacy-page h1 {
  margin: 0 0 24px;
  font-size: clamp(34px, 4vw, 52px);
}

.privacy-page h2 {
  margin: 30px 0 12px;
  font-size: 24px;
}

.privacy-page p {
  margin: 0;
  color: #526071;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.7;
}

.privacy-page a {
  color: #0d6efd;
  font-weight: 800;
}

@media (max-width: 575.98px) {
  .privacy-page {
    padding: 96px 0 48px;
  }

  .privacy-page__card {
    padding: 28px 20px;
    border-radius: 22px;
  }
}
</style>
