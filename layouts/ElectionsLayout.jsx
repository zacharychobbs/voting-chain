import React from 'react';
import ElectionsNav from '../components/ElectionsNav';
import ElectionsTitle from '../components/ElectionsTitle';

const ElectionsLayout = ({ children }) => {
  return (
    <main className="min-h-screen">
      <header className="bg-pattern">
        <div className="w-full max-w-4xl mx-auto px-8 pt-6 pb-16">
          <ElectionsNav />
          <ElectionsTitle />
        </div>
      </header>

      <div className="content w-full rounded-lg -mt-2 mx-auto pb-6 bg-white">
        <div className="w-full max-w-4xl mx-auto px-8 pt-10">{children}</div>
      </div>

      <footer className="py-8" />
    </main>
  );
};

export default ElectionsLayout;