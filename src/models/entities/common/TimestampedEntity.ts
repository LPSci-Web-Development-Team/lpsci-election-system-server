import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class TimestampedEntity {
  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;
}
