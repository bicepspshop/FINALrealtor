"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { getFaqImagesBySection, FaqImage } from "@/lib/faq-storage"

// Helper component to display FAQ images with loading state
const SectionImages = ({ section }: { section: string }) => {
  const [images, setImages] = useState<FaqImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const sectionImages = await getFaqImagesBySection(section);
        setImages(sectionImages);
      } catch (error) {
        console.error(`Error fetching images for section ${section}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [section]);

  if (isLoading) {
    return (
      <div className="mt-4 space-y-2">
        {[1, 2].map(i => (
          <div key={i} className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {images.map((image) => (
        <figure key={image.id} className="rounded-md overflow-hidden border border-border">
          <div className="relative w-full h-[280px]">
            <Image 
              src={image.image_url} 
              alt={image.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {image.description && (
            <figcaption className="p-3 text-sm text-muted-foreground bg-secondary">
              {image.description}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white dark:bg-dark-graphite border-b border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark py-3 sticky top-0 z-50 theme-transition">
        <div className="container-luxury flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-white dark:gold-accent theme-transition">
              РиелторПро
            </h1>
          </Link>
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" /> Вернуться на главную
            </Link>
          </Button>
        </div>
      </header>

      <main className="container-luxury py-12">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-serif text-luxury-black dark:text-white mb-2 tracking-tight">
              Помощь <span className="text-luxury-gold dark:text-luxury-royalBlue">/ FAQ</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Пошаговое руководство по использованию РиелторПро для риелторов
            </p>
          </div>

          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Accordion type="single" collapsible className="bg-white dark:bg-dark-slate border border-border rounded-lg shadow-subtle overflow-hidden">
              <AccordionItem value="item-1" className="border-b border-border px-6">
                <AccordionTrigger className="py-6 text-lg font-medium">
                  Как создать коллекцию объектов недвижимости?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-3">
                    <p>Для создания новой коллекции объектов недвижимости:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Войдите в личный кабинет РиелторПро</li>
                      <li>Перейдите на вкладку "Подборки" в главном меню</li>
                      <li>Нажмите кнопку "Создать подборку"</li>
                      <li>Введите название подборки и описание</li>
                      <li>Нажмите "Создать" для сохранения коллекции</li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-3">
                      Созданная коллекция появится в списке ваших подборок, и вы сможете добавлять в неё объекты недвижимости.
                    </p>
                    
                    <SectionImages section="create-collection" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-border px-6">
                <AccordionTrigger className="py-6 text-lg font-medium">
                  Как добавить квартиры в коллекцию?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-3">
                    <p>Для добавления квартиры в созданную коллекцию:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Откройте нужную коллекцию из списка подборок</li>
                      <li>Нажмите кнопку "Добавить объект"</li>
                      <li>Заполните информацию о квартире (адрес, стоимость, описание, характеристики)</li>
                      <li>Загрузите фотографии объекта, планировку и другие материалы</li>
                      <li>Нажмите "Сохранить" для добавления квартиры в коллекцию</li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-3">
                      Вы можете добавить неограниченное количество объектов в одну коллекцию и редактировать их в любое время.
                    </p>
                    
                    <SectionImages section="add-property" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-border px-6">
                <AccordionTrigger className="py-6 text-lg font-medium">
                  Как отправить коллекцию клиенту?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-3">
                    <p>Отправить коллекцию объектов клиенту можно несколькими способами:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Откройте нужную коллекцию</li>
                      <li>Нажмите кнопку "Поделиться"</li>
                      <li>Выберите один из способов отправки:
                        <ul className="list-disc pl-5 mt-2">
                          <li>По ссылке — скопируйте и отправьте ссылку клиенту</li>
                          <li>По email — введите адрес электронной почты клиента</li>
                          <li>По SMS — введите номер телефона клиента</li>
                          <li>Через мессенджеры — выберите мессенджер и отправьте ссылку</li>
                        </ul>
                      </li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-3">
                      Клиент получит доступ к просмотру коллекции без необходимости регистрации. Вы будете видеть статистику просмотров.
                    </p>
                    
                    <SectionImages section="share-collection" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-border px-6">
                <AccordionTrigger className="py-6 text-lg font-medium">
                  Как отслеживать активность клиентов?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-3">
                    <p>РиелторПро позволяет отслеживать активность клиентов и их взаимодействие с вашими подборками:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Перейдите во вкладку "Клиенты" в главном меню</li>
                      <li>Выберите интересующего клиента из списка</li>
                      <li>В карточке клиента вы увидите:
                        <ul className="list-disc pl-5 mt-2">
                          <li>Список отправленных коллекций</li>
                          <li>Статистику просмотров</li>
                          <li>Какие объекты клиент просматривал дольше всего</li>
                          <li>Какие объекты отмечены как понравившиеся</li>
                        </ul>
                      </li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-3">
                      Эта информация поможет вам лучше понять предпочтения клиента и эффективнее подобрать объекты.
                    </p>
                    
                    <SectionImages section="track-clients" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-border px-6">
                <AccordionTrigger className="py-6 text-lg font-medium">
                  Как редактировать информацию об объектах?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-3">
                    <p>Для редактирования информации об объекте недвижимости:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Откройте коллекцию, содержащую этот объект</li>
                      <li>Найдите нужный объект и нажмите кнопку "Редактировать"</li>
                      <li>Внесите необходимые изменения в информацию об объекте</li>
                      <li>Нажмите "Сохранить" для применения изменений</li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-3">
                      Изменения будут сразу же доступны клиентам, которым вы отправили эту коллекцию.
                    </p>
                    
                    <SectionImages section="edit-property" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="px-6">
                <AccordionTrigger className="py-6 text-lg font-medium">
                  Как настроить свой профиль?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-3">
                    <p>Для настройки своего профиля в системе РиелторПро:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Нажмите на свое имя в правом верхнем углу экрана</li>
                      <li>Выберите "Профиль" из выпадающего меню</li>
                      <li>В разделе профиля вы можете:
                        <ul className="list-disc pl-5 mt-2">
                          <li>Изменить свое фото</li>
                          <li>Обновить контактную информацию</li>
                          <li>Настроить уведомления</li>
                          <li>Изменить пароль и настройки безопасности</li>
                        </ul>
                      </li>
                      <li>После внесения изменений не забудьте нажать "Сохранить"</li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-3">
                      Ваши клиенты будут видеть вашу контактную информацию при просмотре отправленных вами подборок.
                    </p>
                    
                    <SectionImages section="profile-settings" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h3 className="text-xl font-medium mb-4">Нужна дополнительная помощь?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90">
                <Link href="/contact">Связаться с поддержкой</Link>
              </Button>
              <Button variant="outline">
                <Link href="/">Вернуться на главную</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 