import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Task, TaskStatus } from './Task.entity';

export enum ProjectStatus {
  Pending = 'pending',
  Active = 'active',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

@Entity()
export class Project {
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
  status: ProjectStatus = ProjectStatus.Pending;

  @OneToMany(() => Task, (task) => task.project, { eager: true, cascade: true })
  tasks: Task[];

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
    forecasted_at?: Date | null;
  }) {
    const project = new Project(props);
    props.started_at && project.start(props.started_at);
    return project;
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

  start(date: Date) {
    if (this.status === ProjectStatus.Active) {
      throw new Error('Cannot start active project');
    }

    if (this.status === ProjectStatus.Completed) {
      throw new Error('Cannot start completed project');
    }

    if (this.status === ProjectStatus.Cancelled) {
      throw new Error('Cannot start cancelled project');
    }

    this.started_at = date;
    this.status = ProjectStatus.Active;
  }

  cancel(date: Date) {
    if (this.status === ProjectStatus.Completed) {
      throw new Error('Cannot cancel completed project');
    }

    if (this.status === ProjectStatus.Cancelled) {
      throw new Error('Cannot cancel cancelled project');
    }

    if (date < this.started_at!) {
      throw new Error('Cannot cancel project before it started');
    }

    this.cancelled_at = date;
    this.status = ProjectStatus.Cancelled;

    if (!this.tasks) {
      return;
    }

    const pendingOrActiveTasks = this.tasks.filter(
      (task) => task.status === TaskStatus.Pending,
    );
    pendingOrActiveTasks.forEach((task) => task.cancel(date));
  }

  complete(date: Date) {
    if (this.status === ProjectStatus.Completed) {
      throw new Error('Cannot complete completed project');
    }

    if (this.status === ProjectStatus.Cancelled) {
      throw new Error('Cannot complete cancelled project');
    }

    if (date < this.started_at!) {
      throw new Error('Cannot complete project before it started');
    }

    this.finished_at = date;
    this.status = ProjectStatus.Completed;

    if (!this.tasks) {
      return;
    }

    const pendingOrActiveTasks = this.tasks.filter(
      (task) =>
        task.status === TaskStatus.Pending || task.status === TaskStatus.Active,
    );

    if (pendingOrActiveTasks.length > 0) {
      throw new Error('Cannot complete project with pending or active tasks');
    }
  }

  addTask(task: Task) {
    if (this.status === ProjectStatus.Completed) {
      throw new Error('Cannot add task to completed project');
    }

    if (this.status === ProjectStatus.Cancelled) {
      throw new Error('Cannot add task to cancelled project');
    }

    if (this.status === ProjectStatus.Pending && task.started_at) {
      this.start(task.started_at);
    }

    if (
      task.started_at &&
      this.started_at &&
      task.started_at < this.started_at
    ) {
      throw new Error('Cannot add task to project before project started');
    }

    if (!this.tasks) {
      this.tasks = [];
    }

    this.tasks.push(task);
  }
}
