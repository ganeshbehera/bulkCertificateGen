export default function handler(req, res) {
  const sampleData = [
    {
      name: 'Ravi Verma',
      course: 'AI Prompt Engineering Masterclass',
      date: '20 Sep, 2025'
    },
    {
      name: 'Priya Sharma',
      course: 'Machine Learning Fundamentals',
      date: '21 Sep, 2025'
    },
    {
      name: 'Amit Kumar',
      course: 'Data Science Workshop',
      date: '22 Sep, 2025'
    }
  ];

  res.status(200).json({
    message: 'Sample Excel template data',
    data: sampleData,
    headers: ['name', 'course', 'date'],
    instructions: 'Create an Excel file with these columns: name, course, date'
  });
}
