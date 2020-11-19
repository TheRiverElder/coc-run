import React from "react";
import { Item } from "./interfaces/interfaces";

interface InventoryProps {
    className: string;
    inventory: Array<Item>;
    holdingItem: number;
    dropItem: (uid: number) => void;
    holdItem: (uid: number) => void;
    unholdItem: (uid: number) => void;
}

type InventoryState = InventoryProps;

class Inventory extends React.Component<InventoryProps, InventoryState> {

    constructor(props: InventoryProps) {
        super(props);
        this.state = {...props};
    }

    render() {
        return (
            <div className={this.state.className}>
                {this.state.inventory.map(e => (
                    <div key={e.uid} className="item">
                        <span className="description">{e.name}</span>

                        <button 
                            onClick={this.state.dropItem.bind(this, e.uid)} 
                            disabled={this.state.holdingItem === e.uid}
                        >丢弃</button>

                        {e.uid === this.state.holdingItem 
                            ? <button onClick={this.state.unholdItem.bind(null, e.uid)}>卸下</button>
                            : <button onClick={this.state.holdItem.bind(null, e.uid)}>装备</button>
                        }
                    </div>
                ))}
            </div>
        );
    }

    static getDerivedStateFromProps(props: InventoryProps) {
        return {...props};
    }
}

export default Inventory;