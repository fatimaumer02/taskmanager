import React from "react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                            ✨ Boost Your Productivity
                        </span>
                    </div>
                    <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
                        Manage Your Tasks
                        <br />
                        <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Effortlessly
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Stay organized, collaborate with your team, and accomplish more with our intuitive task management platform.
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                        <button className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                            Get Started Free
                        </button>
                        <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                        <div className="bg-linear-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-md">
                            📝
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Smart Tasks
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Create, organize, and prioritize tasks with intelligent categorization and smart reminders.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                        <div className="bg-linear-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-md">
                            👥
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Team Collaboration
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Work together seamlessly with real-time updates, comments, and file sharing.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                        <div className="bg-linear-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-md">
                            📊
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Analytics & Insights
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Track progress with detailed analytics and visualize your productivity trends.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-20 bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
                    <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                        <div>
                            <div className="text-5xl font-bold mb-2">10K+</div>
                            <div className="text-blue-100 text-lg">Active Users</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">50K+</div>
                            <div className="text-blue-100 text-lg">Tasks Completed</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">99%</div>
                            <div className="text-blue-100 text-lg">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of users who are already managing their tasks efficiently.
                    </p>
                    <button className="px-10 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                        Start Your Free Trial
                    </button>
                </div>
            </div>
        </div>
    );
}