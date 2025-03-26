/**
 * Hook para manejar el almacenamiento asíncrono utilizando localStorage.
 */
const useAsyncStore = () => {
  /**
   * Almacena un valor en localStorage.
   * @param nameItem - La clave bajo la cual se almacenará el valor.
   * @param valueItem - El valor que se almacenará (se convierte a JSON).
   */
  const storeData = async (nameItem: string, valueItem: any): Promise<void> => {
    try {
      localStorage.setItem(nameItem, JSON.stringify(valueItem));
    } catch (e) {
      console.error("[Error|useAsyncStore|storeData]", e);
    }
  };

  /**
   * Recupera un valor de localStorage.
   * @param nameItem - La clave del valor que se desea recuperar.
   * @returns El valor almacenado (convertido desde JSON) o `null` si no existe.
   */
  const getData = async (nameItem: string): Promise<any | null> => {
    try {
      const value = localStorage.getItem(nameItem);
      return value !== null ? JSON.parse(value) : null;
    } catch (e) {
      console.error("[Error|useAsyncStore|getData]", e);
      return null;
    }
  };

  /**
   * Elimina un valor de localStorage.
   * @param nameItem - La clave del valor que se desea eliminar.
   */
  const removeData = async (nameItem: string): Promise<void> => {
    try {
      localStorage.removeItem(nameItem);
    } catch (e) {
      console.error("[Error|useAsyncStore|removeData]", e);
    }
  };

  return {
    storeData,
    getData,
    removeData,
  };
};

export { useAsyncStore };