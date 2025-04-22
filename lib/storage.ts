import { getServerClient } from "./supabase"

// Initialize storage bucket
export async function initializeStorage() {
  try {
    console.log("Инициализация хранилища Supabase...")
    const supabase = getServerClient()

    // Проверяем существование бакета
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error("Ошибка при получении списка бакетов:", error)
      return
    }

    const bucketExists = buckets?.find((bucket) => bucket.name === "property-images")

    if (!bucketExists) {
      console.log("Создание бакета 'property-images'...")

      // Создаем бакет, если он не существует
      const { error: createError } = await supabase.storage.createBucket("property-images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        console.error("Ошибка при создании бакета:", createError)
        return
      }

      console.log("Бакет 'property-images' успешно создан")
    } else {
      console.log("Бакет 'property-images' уже существует")
    }

    // Проверяем доступность бакета
    try {
      const testFileName = `test-${Date.now()}.txt`
      const testContent = new Blob(["test"], { type: "text/plain" })

      console.log("Тестирование доступа к хранилищу...")

      // Пробуем загрузить тестовый файл
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(testFileName, testContent)

      if (uploadError) {
        console.error("Тест загрузки не удался:", uploadError)
      } else {
        console.log("Тест загрузки успешен")

        // Удаляем тестовый файл
        await supabase.storage.from("property-images").remove([testFileName])
        console.log("Тестовый файл удален")
      }
    } catch (testError) {
      console.error("Ошибка при тестировании хранилища:", testError)
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
