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
    DishName: string;
    /**餐點類別 */
    DishType: string;
    /**餐點資訊 */
    DishId: string;
  }[];
}
/**find school by name
 * @url https://fatraceschool.k12ea.gov.tw/school?SchoolName=%E7%AB%B9%E6%A9%8B
 */
export interface findSchool extends main {
  data: {
    /**學校ID */
    SchoolId: number;
    /**學校Code */
    SchoolCode: string;
    /**學校名 */
    SchoolName: string;
  }[];
}
