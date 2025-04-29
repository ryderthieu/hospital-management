import React from 'react';

interface Appointment {
  id: number;
  name: string;
  timeRange: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  relativeTime: string;
}

const TodayAppointments: React.FC = () => {
  const appointments: Appointment[] = [
    {
      id: 1,
      name: 'Minahil Khan',
      timeRange: '10:00 - 12:00',
      status: 'upcoming',
      relativeTime: '2 tiếng tới'
    },
    {
      id: 2,
      name: 'Alex Morgan',
      timeRange: '13:00 - 18:00',
      status: 'cancelled',
      relativeTime: '1 tiếng tới'
    },
    {
      id: 3,
      name: 'John Doe',
      timeRange: '10:00 - 12:00',
      status: 'completed',
      relativeTime: '2 hrs ago'
    },
    {
      id: 4,
      name: 'David Beckham',
      timeRange: '06:00 - 08:00',
      status: 'upcoming',
      relativeTime: '3 hrs later'
    },
    {
      id: 5,
      name: 'Amina Smith',
      timeRange: '10:00 - 12:00',
      status: 'completed',
      relativeTime: '4 hrs ago'
    }
  ];

  const getStatusColor = (status: Appointment['status']): string => {
    switch (status) {
      case 'upcoming':
        return 'bg-orange-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Lịch hẹn khám</h2>
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="hidden absolute left-0 top-2 bottom-2 w-0.5 bg-gray-200"></div>
        
        {/* Appointments */}
        <div className="space-y-8">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-start">
              {/* Time indicator */}
              <div className="w-20 flex-shrink-0 text-sm text-gray-500 pr-2">
                {appointment.relativeTime}
              </div>
              
              {/* Status dot */}
              <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0 mr-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(appointment.status)}`}></div>
              </div>
              
              {/* Appointment details */}
              <div className="flex-1">
                <h3 className="text-base text-sm font-medium text-gray-800">{appointment.name}</h3>
                <p className="text-[12px] text-gray-500">{appointment.timeRange}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayAppointments;