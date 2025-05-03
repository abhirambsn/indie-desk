"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFileBasedDB = void 0;
const fs_1 = __importDefault(require("fs"));
const node_crypto_1 = require("node:crypto");
const lodash_1 = __importDefault(require("lodash"));
class JSONFileBasedDB {
    find(tableName, condition) {
        const tableData = this.loadTableData(tableName);
        return tableData.filter((record) => {
            for (const key in condition) {
                if (record[key] !== condition[key]) {
                    return false;
                }
            }
            return true;
        });
    }
    findById(tableName, id) {
        const tableData = this.loadTableData(tableName);
        return tableData.find((record) => record.id === id);
    }
    findOne(tableName, condition) {
        const tableData = this.loadTableData(tableName);
        return tableData.find((record) => {
            for (const key in condition) {
                if (record[key] !== condition[key]) {
                    return false;
                }
            }
            return true;
        });
    }
    insert(tableName, data, autoId = true) {
        const path = this.getTablePath(tableName);
        if (autoId)
            data.id = (0, node_crypto_1.randomUUID)();
        try {
            this.appendToJSONFile(tableName, data);
            return data.id;
        }
        catch (err) {
            console.error(`[DB] Error appending to file ${path}`, err);
        }
    }
    remove(tableName, id) {
        const path = this.getTablePath(tableName);
        const tableData = this.loadTableData(tableName);
        const updatedData = tableData.filter((record) => record.id !== id);
        try {
            fs_1.default.writeFileSync(path, JSON.stringify(updatedData, null, 2));
        }
        catch (err) {
            console.error(`[DB] Error writing to file ${path}`, err);
        }
    }
    updateOne(tableName, id, data) {
        const existingTableData = this.loadTableData(tableName);
        const record = this.findById(tableName, id);
        if (!record) {
            return null;
        }
        const updatedData = lodash_1.default.merge(record, data);
        const path = this.getTablePath(tableName);
        try {
            const combinedTable = existingTableData.map((r) => {
                if (r.id === id) {
                    return updatedData;
                }
                return r;
            });
            fs_1.default.writeFileSync(path, JSON.stringify(combinedTable, null, 2));
            return updatedData;
        }
        catch (err) {
            console.error(`[DB] Error writing to file ${path}`, err);
        }
    }
    upsert(tableName, records) {
        const tableData = this.loadTableData(tableName);
        const updatedData = tableData.map((record) => {
            const newRecord = records.find((r) => r.id === record.id);
            if (newRecord) {
                return newRecord;
            }
            return record;
        });
        const path = this.getTablePath(tableName);
        try {
            fs_1.default.writeFileSync(path, JSON.stringify(updatedData, null, 2));
        }
        catch (err) {
            console.error(`[DB] Error writing to file ${path}`, err);
        }
    }
    getTablePath(tableName) {
        return `${__dirname}/mockdata/${tableName}.json`;
    }
    loadTableData(tableName) {
        const path = this.getTablePath(tableName);
        try {
            const data = fs_1.default.readFileSync(path, 'utf-8');
            return JSON.parse(data);
        }
        catch (err) {
            console.error(`[DB] Error loading file ${path}`, err);
            return [];
        }
    }
    appendToJSONFile(tableName, data) {
        const file = this.loadTableData(tableName);
        const filepath = this.getTablePath(tableName);
        file.push(data);
        fs_1.default.writeFileSync(filepath, JSON.stringify(file, null, 2));
    }
}
exports.JSONFileBasedDB = JSONFileBasedDB;
