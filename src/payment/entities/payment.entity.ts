
import { PrimaryGeneratedColumn ,Column} from "typeorm";
export class Payment {
    @PrimaryGeneratedColumn()
    Pid:number;
    @Column()
    status:number
}
