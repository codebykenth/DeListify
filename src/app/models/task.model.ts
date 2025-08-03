export interface Task {
  uid?: string
  id?: string;
  title: string;
  description: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  category: 'Work' | 'Personal' | 'Other';
  imgUrl?: string;
  completed?: boolean;
  downloadedPhoto?: string;
}