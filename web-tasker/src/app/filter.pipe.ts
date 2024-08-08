import { Pipe, PipeTransform } from '@angular/core';

/**Also remember to update the module declarations*/
@Pipe({ name: 'projectFilter', standalone: true })
export class ProjectFilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    /**note that the below it.'wherever' must match a property
     * in the array of object to be filtered
     */
    return items.filter((it) => {
      return it.projectName.toLocaleLowerCase().includes(searchText);
    });
  }
}

@Pipe({ name: 'teamFilter', standalone: true })
export class TeamFilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    /**note that the below it.'wherever' must match a property
     * in the array of object to be filtered
     */
    return items.filter((it) => {
      return it.teamName.toLocaleLowerCase().includes(searchText);
    });
  }
}

@Pipe({ name: 'userFilter', standalone: true })
export class UserFilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    /**note that the below it.'wherever' must match a property
     * in the array of object to be filtered
     */
    return items.filter((it) => {
      return it.username.toLocaleLowerCase().includes(searchText);
    });
  }
}

@Pipe({ name: 'statusFilter' })
export class StatusFilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    /**note that the below it.'wherever' must match a property
     * in the array of object to be filtered
     */
    return items.filter((it) => {
      return it.status.toLocaleLowerCase().includes(searchText);
    });
  }
}

@Pipe({ name: 'myFilter', pure: false })
export class MyFilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: any[], filter: { [key: string]: any }): any[] {
    if (Object.keys(filter).length == 0) return items;

    let filterKeys = Object.keys(filter);
    return items.filter((item) => {
      return filterKeys.every((keyName) => {
        // console.log(keyName);
        return (
          new RegExp(filter[keyName], 'gi').test(item[keyName]) ||
          filter[keyName] === ''
        );
      });
    });
  }
}
