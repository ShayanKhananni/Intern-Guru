export const  generateTaskDeadlines = (startDate, durationInMonths, totalTasks) => {
  const deadlines = [];
  const start = new Date(startDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + durationInMonths);
  
  const totalDays = (end - start) / (1000 * 60 * 60 * 24);
  const daysPerTask = totalDays / totalTasks;

  for (let i = 1; i <= totalTasks; i++) {
    const deadline = new Date(start);
    const offset = Math.round(i * daysPerTask); 
    deadline.setDate(start.getDate() + offset);
    deadlines.push(deadline.toISOString().split('T')[0]);
  }
  
  return deadlines;
}








