import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from './Project.entity';

export enum TaskStatus {
  Pending = 'pending',
  Active = 'active',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true, type: 'datetime' })
  started_at: Date | null = null;

  @Column({ nullable: true, type: 'datetime' })
  cancelled_at: Date | null = null;

  @Column({ nullable: true, type: 'datetime' })
  finished_at: Date | null = null;

  @Column({ nullable: true, type: 'datetime' })
  forecasted_at: Date | null = null;

  @Column({ type: 'simple-enum' })
  status = TaskStatus.Pending;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  constructor(
    props: {
      name: string;
      description: string;
      started_at?: Date | null;
      cancelled_at?: Date | null;
      finished_at?: Date | null;
      forecasted_at?: Date | null;
    },
    id?: string,
  ) {
    Object.assign(this, props);
    this.id = id ?? crypto.randomUUID();
  }

  static create(props: {
    name: string;
    description: string;
    started_at?: Date | null;
    finished_at?: Date | null;
    forecasted_at?: Date | null;
  }) {
    const task = new Task(props);
    props.started_at && task.start(props.started_at);
    return task;
  }

  start(date: Date) {
    if (this.status === TaskStatus.Active) {
      throw new Error('Cannot start active task');
    }

    if (this.status === TaskStatus.Completed) {
      throw new Error('Cannot start completed task');
    }

    if (this.status === TaskStatus.Cancelled) {
      throw new Error('Cannot start cancelled task');
    }

    this.started_at = date;
    this.status = TaskStatus.Active;
  }

  cancel(date: Date) {
    if (this.status === TaskStatus.Completed) {
      throw new Error('Cannot cancel completed task');
    }

    if (this.status === TaskStatus.Cancelled) {
      throw new Error('Cannot cancel cancelled task');
    }

    this.cancelled_at = date;
    this.status = TaskStatus.Cancelled;
  }

  complete(date: Date) {
    if (this.status === TaskStatus.Completed) {
      throw new Error('Cannot complete completed task');
    }

    if (this.status === TaskStatus.Cancelled) {
      throw new Error('Cannot complete cancelled task');
    }

    this.finished_at = date;
    this.status = TaskStatus.Completed;
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }

  changeForecastedDate(date: Date) {
    this.forecasted_at = date;
  }
}
