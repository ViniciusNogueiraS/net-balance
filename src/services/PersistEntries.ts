import { IEntry, IStorage, IWallet } from "../types/interfaces";

class PersistEntries {

    local: boolean;
    walletId: string;
	
	constructor(local: boolean, walletId: string) {
		this.local = local;
		this.walletId = walletId;
	}

    parse(): IStorage {
        let obj = JSON.parse(window.localStorage.getItem('net-balance-storage') || '');
        obj.wallets = obj.wallets.map((w: IWallet) => {
            return {
                ...w,
                registers: w.registers.map(r => {
                    return {
                        ...r,
                        date: (r.date ? new Date(r.date) : new Date())
                    }
                })
            }
        });
        return obj;
    }

    getEntries() {
        if (this.local) {
            let storage: IStorage = this.parse();
            let index = storage.wallets.findIndex(w => w.id === this.walletId);
            
            return storage.wallets[index].registers;
        }else {

        }
    }

    getEntrieById(id: string) {
        if (this.local) {
            let storage: IStorage = this.parse();
            let index = storage.wallets.findIndex(w => w.id === this.walletId);
            
            return storage.wallets[index].registers.filter(r => r.id === id)[0];
        }else {

        }
    }

    addEntry(entry: IEntry) {
        if (this.local) {
            let storage: IStorage = this.parse();
            let index = storage.wallets.findIndex(w => w.id === this.walletId);
            storage.wallets[index].registers.push(entry);

            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }else {

        }
    }

    removeEntry(id: string) {
        if (this.local) {
            let storage: IStorage = this.parse();
            let index = storage.wallets.findIndex(w => w.id === this.walletId);
            storage.wallets[index].registers = storage.wallets[index].registers.filter(e => e.id !== id);

            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }else {
            
        }
    }

    changeEntry(entry: IEntry) {
        if (this.local) {
            let storage: IStorage = this.parse();
            let indexW = storage.wallets.findIndex(w => w.id === this.walletId);
            let indexE = storage.wallets[indexW].registers.findIndex(e => e.id === entry.id);

            if (indexE >= 0) storage.wallets[indexW].registers[indexE] = entry;
            else return;

            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }else {
            
        }
    }
}

export default PersistEntries;
