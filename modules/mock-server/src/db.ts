import fs from 'fs';
import { randomUUID } from 'node:crypto';

import _ from 'lodash';

interface DB {
  find: (tableName: string, condition: any) => any[];
  findOne: (tableName: string, condition: any) => any;
  findById: (tableName: string, id: string) => any;
  insert: (tableName: string, data: any) => any;
  updateOne: (tableName: string, id: string, data: any) => any;
  remove: (tableName: string, id: string) => any;
  upsert: (tableName: string, records: any[]) => any;
}

export class JSONFileBasedDB implements DB {
  find(tableName: string, condition: any): any[] {
    const tableData = this.loadTableData(tableName);
    return tableData.filter((record: any) => {
      return Object.keys(condition).every((key) => {
        return _.get(record, key) === condition[key];
      });
    });
  }

  findById(tableName: string, id: string): any {
    const tableData = this.loadTableData(tableName);
    return tableData.find((record: any) => record.id === id);
  }

  findOne(tableName: string, condition: any): any {
    const tableData = this.loadTableData(tableName);
    return tableData.find((record: any) => {
      return Object.keys(condition).every((key) => {
        return _.get(record, key) === condition[key];
      });
    });
  }

  insert(tableName: string, data: any, autoId: boolean = true): any {
    const path = this.getTablePath(tableName);
    if (autoId) data.id = randomUUID();
    try {
      this.appendToJSONFile(tableName, data);
      return data.id;
    } catch (err) {
      console.error(`[DB] Error appending to file ${path}`, err);
    }
  }

  remove(tableName: string, id: string): any {
    const path = this.getTablePath(tableName);
    const tableData = this.loadTableData(tableName);
    const updatedData = tableData.filter((record: any) => record.id !== id);
    try {
      fs.writeFileSync(path, JSON.stringify(updatedData, null, 2));
    } catch (err) {
      console.error(`[DB] Error writing to file ${path}`, err);
    }
  }

  updateOne(tableName: string, id: string, data: any): any {
    const existingTableData = this.loadTableData(tableName);
    const record = this.findById(tableName, id);
    if (!record) {
      return null;
    }

    const updatedData = _.merge(record, data);
    const path = this.getTablePath(tableName);
    try {
      const combinedTable = existingTableData.map((r: any) => {
        if (r.id === id) {
          return updatedData;
        }
        return r;
      });
      fs.writeFileSync(path, JSON.stringify(combinedTable, null, 2));
      return updatedData;
    } catch (err) {
      console.error(`[DB] Error writing to file ${path}`, err);
    }
  }

  upsert(tableName: string, records: any[]): any {
    const tableData = this.loadTableData(tableName);
    const updatedData = tableData.map((record: any) => {
      const newRecord = records.find((r: any) => r.id === record.id);
      if (newRecord) {
        return newRecord;
      }
      return record;
    });

    const path = this.getTablePath(tableName);
    try {
      fs.writeFileSync(path, JSON.stringify(updatedData, null, 2));
    } catch (err) {
      console.error(`[DB] Error writing to file ${path}`, err);
    }
  }

  private getTablePath(tableName: string) {
    return `${__dirname}/mockdata/${tableName}.json`;
  }

  private loadTableData(tableName: string): any[] {
    const path = this.getTablePath(tableName);
    try {
      const data = fs.readFileSync(path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`[DB] Error loading file ${path}`, err);
      return [];
    }
  }

  private appendToJSONFile(tableName: string, data: any) {
    const file = this.loadTableData(tableName);
    const filepath = this.getTablePath(tableName);
    file.push(data);
    fs.writeFileSync(filepath, JSON.stringify(file, null, 2));
  }
}
