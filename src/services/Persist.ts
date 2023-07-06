import { IEntry, IStorage } from "../types/interfaces";

class Persist {

    local: boolean
	
	constructor(local: boolean) {
		this.local = local;
        this.prepareStorage();
	}

    parse() {
        let obj = JSON.parse(window.localStorage.getItem('net-balance-storage') || '');
        obj.registers = obj.registers.map((e: any) => {
            return {
                ...e,
                date: new Date(e.date)
            }
        });
        obj.plans = obj.plans.map((e: any) => {
            return {
                ...e,
                date: new Date(e.date)
            }
        });
        return obj;
    }
    
    prepareStorage() {
        if (this.local) {
            const existStorage = window.localStorage.getItem('net-balance-storage');
    
            if (existStorage) return;
    
            const storage: IStorage = {
                registers: [],
                plans: []
            }
    
            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }
    }

    getEntries() {
        if (this.local) {
            let storage: IStorage = this.parse();
            
            return storage.registers;
        }else {

        }
    }

    addEntry(entry: IEntry) {
        if (this.local) {
            let storage: IStorage = this.parse();
            storage.registers.push(entry);

            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }else {

        }
    }

    removeEntry(id: string) {
        if (this.local) {
            let storage: IStorage = this.parse();
            storage.registers = storage.registers.filter(e => e.id !== id);

            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }else {
            
        }
    }

    changeEntry(entry: IEntry) {
        if (this.local) {
            let storage: IStorage = this.parse();
            let i = storage.registers.indexOf(entry);
            storage.registers[i] = entry;

            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }else {
            
        }
    }
}

export default Persist;
