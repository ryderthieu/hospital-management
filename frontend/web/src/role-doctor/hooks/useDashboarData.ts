import { useState, useEffect } from 'react';
import {
  getPatientStatistics,
  getRecentPatients,
} from '../services/patientServices';
import { getUpcomingAppointments, getTodaysAppointments } from '../services/appointmentServices';
import { Patient } from '../types/Patient';
import { Appointment } from '../types/Appointment';

interface DashboardData {
  patientStatistics: {
    totalPatients: number;
    activePatients: number;
    inactivePatients: number;
  };
  recentPatients: Patient[];
  upcomingAppointments: Appointment[];
  todaysAppointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const useDashboardData = (): DashboardData => {
  const [patientStatistics, setPatientStatistics] = useState({
    totalPatients: 0,
    activePatients: 0,
    inactivePatients: 0,
  });
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch patient statistics
        const patientStats = await getPatientStatistics();
        setPatientStatistics(patientStats);

        // Fetch recent patients
        const recentPatientsData = await getRecentPatients();
        setRecentPatients(recentPatientsData);

        // Fetch upcoming appointments
        const upcomingAppointmentsData = await getUpcomingAppointments();
        setUpcomingAppointments(upcomingAppointmentsData);

        // Fetch today's appointments
        const todaysAppointmentsData = await getTodaysAppointments();
        setTodaysAppointments(todaysAppointmentsData);

      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    patientStatistics,
    recentPatients,
    upcomingAppointments,
    todaysAppointments,
    loading,
    error,
  };
};

export default useDashboardData;