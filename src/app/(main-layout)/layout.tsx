import React from 'react';

export default function MainLayout({ children }: Readonly <{children: React.ReactNode }>) {
    return ( <div className="main-layout">
        {children}
        </div>
    );
}