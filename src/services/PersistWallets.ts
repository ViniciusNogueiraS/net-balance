import { IStorage, IWallet } from "../types/interfaces";

class PersistWallets {

    local: boolean;
	
	constructor(local: boolean) {
		this.local = local;
        this.prepareStorage();
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
    
    prepareStorage() {
        if (this.local) {
            const existStorage = window.localStorage.getItem('net-balance-storage');
    
            if (existStorage) return;
    
            const storage: IStorage = {
                wallets: []
            }
    
            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }
    }

    getWallets() {
        if (this.local) {
            let storage: IStorage = this.parse();
            
            return storage.wallets;
        }else {

        }
    }

    addWallet(wallet: IWallet) {
        if (this.local) {
            let storage: IStorage = this.parse();
            storage.wallets.push(wallet);

            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }else {

        }
    }

    removeWallet(id: string) {
        if (this.local) {
            let storage: IStorage = this.parse();
            storage.wallets = storage.wallets.filter(w => w.id !== id);

            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }else {
            
        }
    }

    changeWalletName(id: string, name: string) {
        if (this.local) {
            let storage: IStorage = this.parse();
            let index = storage.wallets.findIndex(w => w.id === id);
            storage.wallets[index].name = name;

            window.localStorage.setItem('net-balance-storage', JSON.stringify(storage));
        }else {
            
        }
    }
}

export default PersistWallets;
