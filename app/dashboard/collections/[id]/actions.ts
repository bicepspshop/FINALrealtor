"use server"

import { getServerClient } from "@/lib/supabase"

interface PropertyData {
  collectionId: string
  propertyType: string
  address: string
  rooms: number | null
  area: number
  price: number
  description: string
  imageUrls: string[]
  floorPlanUrl?: string | null // Добавляем поле для URL планировки
  // Новые поля
  livingArea?: number | null
  floor?: number | null
  totalFloors?: number | null
  balcony?: boolean
  yearBuilt?: number | null
  renovationType?: string | null
  bathroomCount?: number | null
  hasParking?: boolean
  propertyStatus?: string
}

export async function addProperty(data: PropertyData) {
  try {
    console.log("addProperty: Начало добавления объекта")
    console.log("addProperty: Полученные URL изображений:", data.imageUrls)
    console.log("addProperty: Полученный URL планировки:", data.floorPlanUrl)

    const supabase = getServerClient()

    // Проверяем валидность URL изображений
    const validImageUrls = data.imageUrls.filter((url) => url && url.trim() !== "")
    console.log(`addProperty: Валидных URL изображений: ${validImageUrls.length}`)

    // Проверяем существование коллекции
    const { data: collectionExists, error: collectionError } = await supabase
      .from("collections")
      .select("id")
      .eq("id", data.collectionId)
      .single()

    if (collectionError || !collectionExists) {
      console.error("addProperty: Коллекция не найдена:", data.collectionId, collectionError)
      return { error: "Коллекция не найдена" }
    }

    // Insert property
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .insert({
        collection_id: data.collectionId,
        property_type: data.propertyType,
        address: data.address,
        rooms: data.rooms,
        area: data.area,
        price: data.price,
        description: data.description,
        floor_plan_url: data.floorPlanUrl || null, // Добавляем URL планировки
        // Новые поля
        living_area: data.livingArea || null,
        floor: data.floor || null,
        total_floors: data.totalFloors || null,
        balcony: data.balcony || false,
        year_built: data.yearBuilt || null,
        renovation_type: data.renovationType || null,
        bathroom_count: data.bathroomCount || null,
        has_parking: data.hasParking || false,
        property_status: data.propertyStatus || "available",
      })
      .select("id")
      .single()

    if (propertyError) {
      console.error("addProperty: Ошибка добавления объекта:", propertyError)
      return { error: "Не удалось добавить объект: " + propertyError.message }
    }

    console.log("addProperty: Объект успешно добавлен с ID:", property.id)

    // Insert images if any
    if (validImageUrls.length > 0) {
      console.log(`addProperty: Добавление ${validImageUrls.length} изображений для объекта ${property.id}`)

      const imageInserts = validImageUrls.map((url) => ({
        property_id: property.id,
        image_url: url,
      }))

      const { data: imageData, error: imagesError } = await supabase
        .from("property_images")
        .insert(imageInserts)
        .select()

      if (imagesError) {
        console.error("addProperty: Ошибка добавления изображений:", imagesError)
        // We don't return error here as the property was created successfully
      } else {
        console.log(`addProperty: Успешно добавлено ${imageData?.length || 0} изображений`)
      }
    } else {
      console.log("addProperty: Нет изображений для добавления")
    }

    return { success: true, propertyId: property.id }
  } catch (error) {
    console.error("addProperty: Непредвиденная ошибка:", error)
    return { error: "Произошла непредвиденная ошибка: " + (error instanceof Error ? error.message : String(error)) }
  }
}

export async function updateProperty(propertyId: string, data: Omit<PropertyData, "collectionId">) {
  try {
    const supabase = getServerClient()

    // Проверяем существование объекта
    const { data: propertyExists, error: propertyCheckError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", propertyId)
      .single()

    if (propertyCheckError || !propertyExists) {
      console.error("updateProperty: Объект не найден:", propertyId, propertyCheckError)
      return { error: "Объект не найден" }
    }

    // Проверяем валидность URL изображений
    const validImageUrls = data.imageUrls.filter((url) => url && url.trim() !== "")

    // Update property details
    const { error: propertyError } = await supabase
      .from("properties")
      .update({
        property_type: data.propertyType,
        address: data.address,
        rooms: data.rooms,
        area: data.area,
        price: data.price,
        description: data.description,
        floor_plan_url: data.floorPlanUrl || null, // Добавляем URL планировки
        // Новые поля
        living_area: data.livingArea || null,
        floor: data.floor || null,
        total_floors: data.totalFloors || null,
        balcony: data.balcony || false,
        year_built: data.yearBuilt || null,
        renovation_type: data.renovationType || null,
        bathroom_count: data.bathroomCount || null,
        has_parking: data.hasParking || false,
        property_status: data.propertyStatus || "available",
      })
      .eq("id", propertyId)

    if (propertyError) {
      console.error("Error updating property:", propertyError)
      return { error: "Failed to update property: " + propertyError.message }
    }

    // Get existing images
    const { data: existingImages, error: fetchError } = await supabase
      .from("property_images")
      .select("id, image_url")
      .eq("property_id", propertyId)

    if (fetchError) {
      console.error("Error fetching existing images:", fetchError)
      return { error: "Failed to update property images: " + fetchError.message }
    }

    // Find images to delete (images that exist in DB but not in the updated list)
    const existingUrls = existingImages.map((img) => img.image_url)
    const imagesToDelete = existingImages.filter((img) => !validImageUrls.includes(img.image_url))

    // Delete removed images
    if (imagesToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("property_images")
        .delete()
        .in(
          "id",
          imagesToDelete.map((img) => img.id),
        )

      if (deleteError) {
        console.error("Error deleting property images:", deleteError)
      }
    }

    // Add new images
    const newUrls = validImageUrls.filter((url) => !existingUrls.includes(url))
    if (newUrls.length > 0) {
      const imageInserts = newUrls.map((url) => ({
        property_id: propertyId,
        image_url: url,
      }))

      const { error: imagesError } = await supabase.from("property_images").insert(imageInserts)

      if (imagesError) {
        console.error("Error adding new property images:", imagesError)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating property:", error)
    return { error: "An unexpected error occurred: " + (error instanceof Error ? error.message : String(error)) }
  }
}

export async function deleteProperty(propertyId: string) {
  try {
    const supabase = getServerClient()

    // Проверяем существование объекта
    const { data: propertyExists, error: propertyCheckError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", propertyId)
      .single()

    if (propertyCheckError || !propertyExists) {
      console.error("deleteProperty: Объект не найден:", propertyId, propertyCheckError)
      return { error: "Объект не найден" }
    }

    // Delete property (cascade will delete images)
    const { error } = await supabase.from("properties").delete().eq("id", propertyId)

    if (error) {
      console.error("Error deleting property:", error)
      return { error: "Failed to delete property: " + error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting property:", error)
    return { error: "An unexpected error occurred: " + (error instanceof Error ? error.message : String(error)) }
  }
}

export async function getPropertyById(propertyId: string) {
  try {
    const supabase = getServerClient()

    const { data, error } = await supabase
      .from("properties")
      .select(`
        id, 
        property_type, 
        address, 
        rooms, 
        area, 
        price, 
        description,
        floor_plan_url,
        living_area,
        floor,
        total_floors,
        balcony,
        year_built,
        renovation_type,
        bathroom_count,
        has_parking,
        property_status,
        property_images (id, image_url)
      `)
      .eq("id", propertyId)
      .single()

    if (error) {
      console.error("Error fetching property:", error)
      return { error: "Failed to fetch property: " + error.message }
    }

    return { success: true, property: data }
  } catch (error) {
    console.error("Unexpected error fetching property:", error)
    return { error: "An unexpected error occurred: " + (error instanceof Error ? error.message : String(error)) }
  }
}
