import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Пользовательское соглашение | РиелторПро',
  description: 'Пользовательское соглашение платформы РиелторПро',
}

export default function AgreementPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-dark-charcoal border-b border-gray-100 dark:border-dark-slate py-4 theme-transition">
        <div className="container-luxury">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-luxury-black dark:text-white theme-transition">
                <path d="M22 12C22 10.6868 21.7413 9.38647 21.2388 8.1731C20.7363 6.95996 19.9997 5.85742 19.0711 4.92893C18.1425 4.00043 17.04 3.26374 15.8269 2.7612C14.6138 2.25866 13.3132 2 12 2C10.6868 2 9.38647 2.25866 8.1731 2.7612C6.95996 3.26374 5.85742 4.00043 4.92893 4.92893C4.00043 5.85742 3.26374 6.95996 2.7612 8.1731C2.25866 9.38647 2 10.6868 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 13H9.67C9.67 13 10 13 10.25 12.8C10.5 12.6 10.5 12.5 10.5 12.5C10.5 12.5 10.5 12.4 10.25 12.2C10 12 9.67 12 9.67 12H8.5C8.5 12 7.83 12 7.33 12.5C6.83 13 6.83 13.67 6.83 13.67V16.33C6.83 16.33 6.83 17 7.33 17.5C7.83 18 8.5 18 8.5 18H9.67C9.67 18 10 18 10.25 17.8C10.5 17.6 10.5 17.5 10.5 17.5C10.5 17.5 10.5 17.4 10.25 17.2C10 17 9.67 17 9.67 17H8V16H9.4C9.4 16 9.73 16 9.98 15.8C10.23 15.6 10.23 15.5 10.23 15.5C10.23 15.5 10.23 15.4 9.98 15.2C9.73 15 9.4 15 9.4 15H8V13Z" fill="currentColor"/>
                <path d="M12.5 17V13.5V13M12.5 17V13.5C12.5 13 13 12.5 13.5 12.5C14 12.5 14.5 13 14.5 13.5V17M12.5 17H11.5M14.5 17H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 17V13C17.5 12.6 17.6 12.3 17.8 12C18 11.7 18.2 11.5 18.6 11.5C19 11.5 19.2 11.7 19.4 12C19.6 12.3 19.7 12.6 19.7 13V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 13C17.5 13 17.5 12 18.5 12C19.5 12 19.5 13 19.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-lg font-serif text-luxury-black dark:text-white theme-transition">РиелторПро</span>
            </Link>
            <Link href="/" className="text-sm text-luxury-black dark:text-white hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">
              На главную
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-white dark:bg-dark-charcoal theme-transition">
        <div className="container-luxury py-16">
          <h1 className="text-3xl md:text-4xl font-serif mb-12 text-luxury-black dark:text-white theme-transition">Пользовательское соглашение</h1>
          
          <div className="bg-gray-50 dark:bg-dark-slate p-8 rounded-lg shadow-sm theme-transition">
            <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-serif theme-transition">
              <h2 className="text-2xl mb-4">Публичная оферта (Пользовательское соглашение)</h2>
              
              <p className="mb-6">Настоящая Публичная оферта (далее – «Соглашение») опубликована самозанятым Анисимовым Константином Александровичем (ИНН 526319437963, адрес регистрации: г. Нижний Новгород, ул. Тонкинская, д. 13, кв. 8) и содержит все условия предоставления платной подписки на сервис https://риелторпро.рф.</p>

              <h3 className="text-xl mb-3 mt-8">1. Общие положения</h3>
              <p>1.1. Настоящее Соглашение является публичной офертой и регулирует отношения между Исполнителем (самозанятым Анисимовым К.А.) и Пользователем.</p>
              <p>1.2. Акцепт оферты и вступление Соглашения в силу происходит с момента полной и безусловной оплаты Пользователем выбранного тарифа:</p>
              <ul className="list-disc pl-8 mb-4">
                <li>Ежемесячная подписка — 2 000 ₽;</li>
                <li>Годовая подписка — 16 800 ₽.</li>
              </ul>
              <p>1.3. Оплата производится онлайн любыми доступными в платёжной системе способами (банковские карты, электронные кошельки и др.).</p>
              <p>1.4. Все отношения регулируются:</p>
              <ul className="list-disc pl-8 mb-4">
                <li>ГК РФ: ст. 494 (публичная оферта) и ст. 779 (договор возмездного оказания услуг);</li>
                <li>ФЗ № 2300‑1 «О защите прав потребителей»;</li>
                <li>ФЗ № 54‑ФЗ «О применении контрольно-кассовой техники»;</li>
                <li>ФЗ № 152‑ФЗ «О персональных данных».</li>
              </ul>

              <h3 className="text-xl mb-3 mt-8">2. Предмет договора</h3>
              <p>2.1. Исполнитель предоставляет Пользователю доступ к функционалу сервиса: CRM-модуль, аналитика, интеграции, телефония и др.</p>
              <p>2.2. Описание тарифов и их стоимость указаны на странице подписки: https://риелторпро.рф.</p>

              <h3 className="text-xl mb-3 mt-8">3. Порядок оплаты и документы</h3>
              <p>3.1. После оплаты формируется электронный чек ККТ и/или акт оказанных услуг в соответствии с требованиями ФЗ № 54‑ФЗ.</p>
              <p>3.2. По запросу Пользователя Исполнитель направляет копию электронного документа на email: rieltorprorf@mail.ru.</p>

              <h3 className="text-xl mb-3 mt-8">4. Права и обязанности сторон</h3>
              <p>4.1. Исполнитель обязуется:</p>
              <ul className="list-disc pl-8 mb-4">
                <li>Обеспечивать доступность сервиса, за исключением плановых и аварийных работ;</li>
                <li>Оказывать техническую поддержку в рамках выбранного тарифа.</li>
              </ul>
              <p>4.2. Пользователь обязуется:</p>
              <ul className="list-disc pl-8 mb-4">
                <li>Своевременно оплачивать подписку;</li>
                <li>Хранить в тайне и не передавать третьим лицам свои учётные данные;</li>
                <li>Использовать сервис в соответствии с документацией и условиями Соглашения.</li>
              </ul>
              <p>4.3. Пользователь вправе отказаться до активации доступа и потребовать полного возврата уплаченной суммы в течение 14 дней с момента оплаты.</p>

              <h3 className="text-xl mb-3 mt-8">5. Автоматическое продление и расторжение</h3>
              <p>5.1. По истечении оплаченного периода подписка автоматически продлевается на аналогичный срок и списывается соответствующая сумма.</p>
              <p>5.2. Пользователь может отключить автопродление в личном кабинете не позднее чем за 3 рабочих дня до окончания текущего периода.</p>
              <p>5.3. Исполнитель вправе приостановить или прекратить доступ в случае несвоевременной оплаты или нарушения условий Соглашения.</p>

              <h3 className="text-xl mb-3 mt-8">6. Возврат денежных средств</h3>
              <p>6.1. Пробный период: 14 дней бесплатного доступа; при отказе полный возврат средств в течение 10 дней после запроса.</p>
              <p>6.2. После пробного периода: возврат за неиспользованное время по письменному запросу в течение 10 дней.</p>
              <p>6.3. Отказ регулируется ст. 782 ГК РФ (возмещение фактически понесённых расходов Исполнителем).</p>

              <h3 className="text-xl mb-3 mt-8">7. Обработка персональных данных</h3>
              <p>7.1. Исполнитель получает и обрабатывает персональные данные Пользователя (ФИО, email, телефон) для исполнения Соглашения в соответствии с ФЗ № 152‑ФЗ.</p>
              <p>7.2. Пользователь даёт согласие при акцепте оферты.</p>

              <h3 className="text-xl mb-3 mt-8">8. Ответственность сторон и разрешение споров</h3>
              <p>8.1. Стороны несут ответственность в соответствии с ГК РФ и ФЗ № 2300‑1.</p>
              <p>8.2. Споры решаются путём переговоров, при недостижении соглашения — в арбитражном суде по месту регистрации Исполнителя (г. Нижний Новгород).</p>

              <div className="mt-12 border-t border-gray-200 dark:border-dark-slate pt-6 theme-transition">
                <h3 className="text-xl mb-4">Исполнитель:</h3>
                <p className="mb-1">Анисимов Константин Александрович, ИНН 526319437963,</p>
                <p className="mb-1">г. Нижний Новгород, ул. Тонкинская, д. 13, кв. 8.</p>
                <p className="mb-1">Email: rieltorprorf@mail.ru | Телефон: +7 999 137-89-19</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-luxury-black dark:bg-dark-charcoal text-white pt-16 pb-8 border-t border-white/10 dark:border-dark-slate theme-transition">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-serif mb-6 text-white dark:text-white theme-transition">РиелторПро</h3>
              <p className="text-white/90 dark:text-white/80 mb-6 theme-transition">Платформа для риелторов, которая упрощает работу с клиентами и делает презентацию недвижимости более профессиональной.</p>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-white dark:text-white theme-transition">Навигация</h4>
              <ul className="space-y-3">
                <li><Link href="/#features" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">Возможности</Link></li>
                <li><Link href="/about" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">О платформе</Link></li>
                <li><Link href="/#contact" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">Контакты</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-white dark:text-white theme-transition">Правовая информация</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/agreement" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">Пользовательское соглашение</Link>
                </li>
                <li><Link href="/requisites" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">Реквизиты</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-white dark:text-white theme-transition">Контакты</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-luxury-gold dark:text-luxury-royalBlue theme-transition">
                    <path d="M22 12C22 10.6868 21.7413 9.38647 21.2388 8.1731C20.7363 6.95996 19.9997 5.85742 19.0711 4.92893C18.1425 4.00043 17.04 3.26374 15.8269 2.7612C14.6138 2.25866 13.3132 2 12 2C10.6868 2 9.38647 2.25866 8.1731 2.7612C6.95996 3.26374 5.85742 4.00043 4.92893 4.92893C4.00043 5.85742 3.26374 6.95996 2.7612 8.1731C2.25866 9.38647 2 10.6868 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 13H9.67C9.67 13 10 13 10.25 12.8C10.5 12.6 10.5 12.5 10.5 12.5C10.5 12.5 10.5 12.4 10.25 12.2C10 12 9.67 12 9.67 12H8.5C8.5 12 7.83 12 7.33 12.5C6.83 13 6.83 13.67 6.83 13.67V16.33C6.83 16.33 6.83 17 7.33 17.5C7.83 18 8.5 18 8.5 18H9.67C9.67 18 10 18 10.25 17.8C10.5 17.6 10.5 17.5 10.5 17.5C10.5 17.5 10.5 17.4 10.25 17.2C10 17 9.67 17 9.67 17H8V16H9.4C9.4 16 9.73 16 9.98 15.8C10.23 15.6 10.23 15.5 10.23 15.5C10.23 15.5 10.23 15.4 9.98 15.2C9.73 15 9.4 15 9.4 15H8V13Z" fill="currentColor"/>
                    <path d="M12.5 17V13.5V13M12.5 17V13.5C12.5 13 13 12.5 13.5 12.5C14 12.5 14.5 13 14.5 13.5V17M12.5 17H11.5M14.5 17H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 17V13C17.5 12.6 17.6 12.3 17.8 12C18 11.7 18.2 11.5 18.6 11.5C19 11.5 19.2 11.7 19.4 12C19.6 12.3 19.7 12.6 19.7 13V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 13C17.5 13 17.5 12 18.5 12C19.5 12 19.5 13 19.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/90 dark:text-white/80 theme-transition">rieltorprorf@mail.ru</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-luxury-gold dark:text-luxury-royalBlue theme-transition">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/90 dark:text-white/80 theme-transition">+79991378919</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 dark:border-dark-slate text-center text-white/50 theme-transition">
            <p className="text-white/90 dark:text-white/80 theme-transition">&copy; {new Date().getFullYear()} РиелторПро. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 