'use client';

import { useState, useEffect } from 'react';
import { getBrowserClient } from '@/lib/supabase';
import { Search, Filter } from 'lucide-react';

type Property = {
  id: string;
  property_type: string;
  address: string;
  rooms: number | null;
  area: number;
  price: number;
  property_status: string;
  collection_id: string;
  collection_name: string;
  owner_name: string;
  owner_email: string;
  created_at: string;
};

type PropertiesTabProps = {
  userId: string;
};

const PropertiesTab = ({ userId }: PropertiesTabProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  
  const supabase = getBrowserClient();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Fetch properties with collection and owner data
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          collections:collection_id (
            name:name,
            users:user_id (
              name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process and normalize the data
      const processedData = (data || []).map((item: any) => {
        return {
          id: item.id,
          property_type: item.property_type,
          address: item.address,
          rooms: item.rooms,
          area: item.area,
          price: item.price,
          property_status: item.property_status,
          collection_id: item.collection_id,
          collection_name: item.collections?.name || 'Неизвестная коллекция',
          owner_name: item.collections?.users?.name || 'Неизвестный пользователь',
          owner_email: item.collections?.users?.email || 'unknown@example.com',
          created_at: item.created_at,
        };
      });
      
      setProperties(processedData);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get unique property types for filter
  const propertyTypes = Array.from(new Set(properties.map(p => p.property_type)));
  
  // Filter properties based on search query and property type filter
  const filteredProperties = properties.filter(prop => {
    // Apply search filter
    const matchesSearch = !searchQuery || 
      prop.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.owner_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.collection_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply property type filter
    const matchesType = propertyTypeFilter === 'all' || prop.property_type === propertyTypeFilter;
    
    return matchesSearch && matchesType;
  });
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот объект? Это действие необратимо.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);
      
      if (error) throw error;
      
      // Update local state
      setProperties(properties.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Не удалось удалить объект. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Управление объектами недвижимости</h2>
      
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по адресу, коллекции или владельцу..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Property type filter */}
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">Все типы</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>
                {type === 'apartment' ? 'Квартира' :
                 type === 'house' ? 'Дом' :
                 type === 'commercial' ? 'Коммерческая' :
                 type === 'land' ? 'Земельный участок' : type}
              </option>
            ))}
          </select>
        </div>
        
        {/* Refresh button */}
        <button 
          onClick={fetchProperties}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Обновить
        </button>
      </div>
      
      {/* Properties table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2">Адрес</th>
              <th className="px-4 py-2">Тип</th>
              <th className="px-4 py-2">Площадь</th>
              <th className="px-4 py-2">Цена</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Владелец</th>
              <th className="px-4 py-2">Коллекция</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-2 text-center">Загрузка...</td>
              </tr>
            ) : filteredProperties.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-2 text-center">Объекты не найдены</td>
              </tr>
            ) : (
              filteredProperties.map(property => (
                <tr key={property.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">
                    <div className="max-w-[250px] truncate" title={property.address}>
                      {property.address}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {property.property_type === 'apartment' ? 'Квартира' :
                     property.property_type === 'house' ? 'Дом' :
                     property.property_type === 'commercial' ? 'Коммерческая' :
                     property.property_type === 'land' ? 'Земельный участок' : 
                     property.property_type}
                  </td>
                  <td className="px-4 py-2">{property.area} м²</td>
                  <td className="px-4 py-2">{formatPrice(property.price)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      property.property_status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      property.property_status === 'sold' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      property.property_status === 'reserved' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {property.property_status === 'available' ? 'Доступен' :
                       property.property_status === 'sold' ? 'Продан' :
                       property.property_status === 'reserved' ? 'Зарезервирован' : 
                       property.property_status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="max-w-[150px]">
                      <div className="truncate" title={property.owner_name}>{property.owner_name}</div>
                      <div className="text-xs text-gray-500 truncate" title={property.owner_email}>{property.owner_email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="max-w-[150px] truncate" title={property.collection_name}>
                      {property.collection_name}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertiesTab; 