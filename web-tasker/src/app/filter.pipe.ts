import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'projectFilter' })
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

@Pipe({ name: 'teamFilter' })
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

@Pipe({ name: 'userFilter' })
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
