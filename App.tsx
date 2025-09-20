import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';
import type { Attendee } from './types';

type View = 'form' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('form');
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    try {
      const storedAttendees = localStorage.getItem('summitAttendees');
      if (storedAttendees) {
        const parsedAttendees: Attendee[] = JSON.parse(storedAttendees);
        // Sort by most recent submission
        parsedAttendees.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setAttendees(parsedAttendees);
      }
    } catch (error) {
      console.error("Failed to load attendees from localStorage", error);
      setAttendees([]);
    }
  }, []);

  const handleFormSubmit = useCallback((newAttendeeData: Omit<Attendee, 'id' | 'submittedAt'>) => {
    setAttendees(currentAttendees => {
      const newAttendee: Attendee = {
        ...newAttendeeData,
        id: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
      };
      const updatedAttendees = [newAttendee, ...currentAttendees];
      try {
        localStorage.setItem('summitAttendees', JSON.stringify(updatedAttendees));
      } catch (error) {
        console.error("Failed to save attendees to localStorage", error);
      }
      return updatedAttendees;
    });
  }, []);

  const renderView = () => {
    switch (view) {
      case 'admin':
        return <AdminPanel attendees={attendees} onBack={() => setView('form')} />;
      case 'form':
      default:
        return <RegistrationForm onFormSubmit={handleFormSubmit} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <Header />
      <main className="w-full flex-grow flex items-center justify-center">
        {renderView()}
      </main>
      <footer className="w-full text-center py-6 mt-8">
        {view === 'form' && (
          <button
            onClick={() => setView('admin')}
            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            Admin Panel
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;