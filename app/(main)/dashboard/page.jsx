import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react';
import DashboardView from './_components/dashboard-view';
import { getIndustryInsights } from '@/actions/dashboard';
import Chatbot from '@/components/Chatbot';

const IndustryInsightsPage = async () => {
    // ✅ First, check if user has completed onboarding
    const { isOnboarded } = await getUserOnboardingStatus();
    
    if (!isOnboarded) {
        redirect("/onboarding");
    }

    // ✅ Only fetch insights AFTER confirming user is onboarded
    const insights = await getIndustryInsights();

    return (
        <div className='container mx-auto'>
            <DashboardView insights={insights} />
        
            {/* Chatbot Component */}
            <Chatbot />
        </div>
    );
};

export default IndustryInsightsPage;
