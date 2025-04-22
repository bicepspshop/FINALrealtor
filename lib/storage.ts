import { getServerClient } from "./supabase"

// Initialize storage buckets
export async function initializeStorage() {
  try {
    console.log("Инициализация хранилища Supabase...")
    const supabase = getServerClient()

    // Проверяем существование бакетов
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error("Ошибка при получении списка бакетов:", error)
      return
    }

    // Определяем все необходимые бакеты и их настройки
    const requiredBuckets = [
      { name: "property-images", public: true, fileSizeLimit: 10485760 }, // 10MB
      { name: "collection-covers", public: true, fileSizeLimit: 5242880 }, // 5MB
      { name: "avatars", public: true, fileSizeLimit: 5242880 } // 5MB
    ]

    // Создаем отсутствующие бакеты
    for (const bucketConfig of requiredBuckets) {
      const bucketExists = buckets?.find((bucket) => bucket.name === bucketConfig.name)

      if (!bucketExists) {
        console.log(`Создание бакета '${bucketConfig.name}'...`)

        // Создаем бакет, если он не существует
        const { error: createError } = await supabase.storage.createBucket(bucketConfig.name, {
          public: bucketConfig.public,
          fileSizeLimit: bucketConfig.fileSizeLimit,
        })

        if (createError) {
          console.error(`Ошибка при создании бакета '${bucketConfig.name}':`, createError)
          continue
        }

        // Устанавливаем политики доступа для бакета
        // Разрешаем публичный доступ для чтения и загрузки
        try {
          const { error: policyError } = await supabase.storage.from(bucketConfig.name).createSignedUploadUrl('test.txt')
          if (policyError) {
            console.error(`Ошибка при настройке политик для бакета '${bucketConfig.name}':`, policyError)
          }
        } catch (policyError) {
          console.error(`Ошибка при настройке политик для бакета '${bucketConfig.name}':`, policyError)
        }

        console.log(`Бакет '${bucketConfig.name}' успешно создан`)
      } else {
        console.log(`Бакет '${bucketConfig.name}' уже существует`)
      }

      // Проверяем доступность бакета для загрузки
      try {
        const testFileName = `test-${Date.now()}.txt`
        const testContent = new Blob(["test"], { type: "text/plain" })

        console.log(`Тестирование доступа к хранилищу '${bucketConfig.name}'...`)

        // Пробуем загрузить тестовый файл
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketConfig.name)
          .upload(testFileName, testContent)

        if (uploadError) {
          console.error(`Тест загрузки в '${bucketConfig.name}' не удался:`, uploadError)
        } else {
          console.log(`Тест загрузки в '${bucketConfig.name}' успешен`)

          // Удаляем тестовый файл
          await supabase.storage.from(bucketConfig.name).remove([testFileName])
          console.log(`Тестовый файл из '${bucketConfig.name}' удален`)
        }
      } catch (testError) {
        console.error(`Ошибка при тестировании хранилища '${bucketConfig.name}':`, testError)
      }
    }
  } catch (error) {
    console.error("Непредвиденная ошибка при инициализации хранилища:", error)
  }
}

// Get public URL for a file
export function getPublicUrl(bucketName: string, filePath: string) {
  const supabase = getServerClient()
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return data.publicUrl
}
