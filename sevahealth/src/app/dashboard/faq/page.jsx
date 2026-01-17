// File: src/app/dashboard/faq/page.jsx
'use client';

import { useState } from 'react';

const faqs = [
    {
        id: 1,
        q: '1. What is SevaHealth?',
        a: 'SevaHealth is a healthcare management application designed for community health programs, enabling supervisors to monitor patients, workers (like ASHA), alerts, and field reports from a central dashboard.'
    },
    {
        id: 2,
        q: '2. How do I log in to the SevaHealth app?',
        a: 'You can log in using your registered email and password on the login page. Once authenticated, you\'ll be taken to the dashboard where you can view patients, workers, alerts, and reports.'
    },
    {
        id: 3,
        q: '3. What features are available on the dashboard?',
        a: 'The dashboard provides quick access to:\n• Total registered patients\n• Active health workers\n• Alerts requiring attention\n• Summary of health reports'
    },
    {
        id: 4,
        q: '4. Can I search for patient or worker records?',
        a: 'Yes, the navbar includes a search bar that lets you search across patients, workers, and reports.'
    },
    {
        id: 5,
        q: '5. How are alerts displayed and managed?',
        a: 'Alerts are shown in the "Alerts" section — you can view urgent messages and mark them as read. Unread alerts are indicated with a badge.'
    },
    {
        id: 6,
        q: '6. What is the Reports section for?',
        a: 'The "Reports" section lists submitted health reports, such as medical checkups, surveys, or activity logs submitted by workers.'
    },
    {
        id: 7,
        q: '7. Does SevaHealth work offline?',
        a: 'Yes — the app includes offline sync functionality. When network connectivity is lost, operations are queued and synchronized once you\'re online again.'
    },
    {
        id: 8,
        q: '8. How do I know if I\'m offline or online in the app?',
        a: 'The navbar shows your connectivity status with icons (Wi-Fi / Wi-Fi off). It also shows the number of pending sync actions if offline.'
    },
    {
        id: 9,
        q: '9. How do I synchronize data when offline?',
        a: 'If you\'re offline and there are queued actions, a "Sync" button appears — tap it once you\'re online to upload local changes to the server.'
    },
    {
        id: 10,
        q: '10. Can I change the app language?',
        a: 'Yes! You can switch between English and Hindi from the language selector in the navbar.'
    },
    {
        id: 11,
        q: '11. Where are my account settings and profile?',
        a: 'Click the profile icon in the navbar to access your profile, settings, or logout options.'
    },
    {
        id: 12,
        q: '12. Who can use this app?',
        a: 'The app is built for supervisors and administrators in healthcare programs who need to manage workers, patients, alerts, and reports efficiently.'
    },
    {
        id: 13,
        q: '13. Does the app support notifications?',
        a: 'Yes, there\'s a notification panel accessible via the bell icon in the navbar that shows recent updates and alerts.'
    },
    {
        id: 14,
        q: '14. How do I log out of the app?',
        a: 'Open the profile dropdown in the navbar and select the "Logout" option to end your session.'
    },
    {
        id: 15,
        q: '15. How is data stored?',
        a: 'The app uses Supabase for backend data storage and synchronization. Local storage and sync managers help with offline capabilities.'
    },
    {
        id: 16,
        q: '16. Who do I contact for support?',
        a: 'For help with the app, you can reach out to the development team or supervisor contact provided during onboarding.'
    }
];

export default function FAQPage() {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Simple Header - No icon */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">FAQ</h1>
                    <p className="text-gray-600">Frequently Asked Questions</p>
                </div>

                {/* FAQ List */}
                <div className="bg-white rounded-lg border border-gray-200">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="border-b border-gray-200 last:border-b-0">
                            <button
                                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                            >
                                <span className="font-medium text-gray-800">{faq.q}</span>
                                <span className="text-gray-500 text-lg">
                                    {openFaq === faq.id ? '−' : '+'}
                                </span>
                            </button>

                            {openFaq === faq.id && (
                                <div className="px-6 pb-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700 whitespace-pre-line">{faq.a}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Simple Support Info */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-blue-800">Need more help?</p>
                    <p className="text-sm text-blue-700 mt-1">Contact support using the contact provided during onboarding.</p>
                </div>
            </div>
        </div>
    );
}