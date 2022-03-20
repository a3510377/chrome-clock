export interface main {
  result: number;
  data: Object;
}

export interface mealDataType extends main {
  data: {
    /**data id */
    BatchDataId: string;
    /**供應商 */
    KitchenName: string;
    /**學校ID */
    SchoolId: number;
    /**學校名 */
    SchoolName: string;
    /**菜單時間 */
    MenuDate: string;
    /**菜單種類 */
    MenuTypeName: string;
    /**更新時間 */
    UploadDateTime: string;
  }[];
}
export interface menuType extends main {
  data: {
    /**餐點名 */
    DishName: "糙米飯";
    /**餐點類別 */
    DishType: "主食";
    /**餐點資訊 */
    DishId: "1581641696253424";
  }[];
}
