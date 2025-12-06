import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { fetchStudyGroups } from '../../store/slices/collaborationSlice';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  memberCount: number;
  maxMembers: number;
  privacy: 'public' | 'private';
  isJoined: boolean;
  meetingSchedule: {
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
    day: string;
    time: string;
    duration: number; // in minutes
    timezone: string;
  };
  location?: {
    type: 'online' | 'in-person' | 'hybrid';
    platform?: string;
    address?: string;
  };
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  nextMeeting?: {
    date: Date;
    topic: string;
    attendees: number;
  };
  recentActivity: {
    type: 'message' | 'member_join' | 'meeting_scheduled';
    description: string;
    timestamp: Date;
    user: string;
  }[];
  tags: string[];
  createdAt: Date;
}

const CollaborationDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { studyGroups, loading } = useSelector((state: RootState) => state.collaboration);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedPrivacy, setSelectedPrivacy] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterJoined, setFilterJoined] = useState(false);

  useEffect(() => {
    dispatch(fetchStudyGroups());
  }, [dispatch]);

  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Literature', 'History'];
  const privacyOptions = ['All', 'Public', 'Private'];

  const filteredGroups = studyGroups?.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || group.subject === selectedSubject;
    const matchesPrivacy = selectedPrivacy === 'All' || 
                          (selectedPrivacy === 'Public' && group.privacy === 'public') ||
                          (selectedPrivacy === 'Private' && group.privacy === 'private');
    const matchesJoined = !filterJoined || group.isJoined;
    
    return matchesSearch && matchesSubject && matchesPrivacy && matchesJoined;
  }) || [];

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'bi-weekly': return 'Bi-weekly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'member_join': return <UserGroupIcon className="w-4 h-4" />;
      case 'meeting_scheduled': return <CalendarIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading study groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Groups</h1>
              <p className="text-gray-600">
                Collaborate with peers and learn together in interactive study groups
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Group
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Groups</p>
                  <p className="text-2xl font-semibold text-gray-900">{studyGroups?.length || 0}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Joined Groups</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {studyGroups?.filter(g => g.isJoined).length || 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {studyGroups?.filter(g => g.nextMeeting).length || 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GlobeAltIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {studyGroups?.reduce((total, group) => total + group.memberCount, 0) || 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search study groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring--blue-500"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Privacy Filter */}
              <div>
                <select
                  value={selectedPrivacy}
                  onChange={(e) => setSelectedPrivacy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {privacyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Joined Filter */}
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filterJoined}
                    onChange={(e) => setFilterJoined(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Joined only</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Study Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">
                      {group.subject}
                    </span>
                    {group.privacy === 'private' ? (
                      <LockClosedIcon className="w-4 h-4 text-gray-400" />
                    ) : (
                      <GlobeAltIcon className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {group.isJoined && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Joined
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {group.name}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3">
                  {group.description}
                </p>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    <span>{group.memberCount}/{group.maxMembers} members</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{group.meetingSchedule.duration}min</span>
                  </div>
                </div>

                {/* Meeting Schedule */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>{getFrequencyText(group.meetingSchedule.frequency)} meetings</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {group.meetingSchedule.day}s at {formatTime(group.meetingSchedule.time)}
                  </div>
                </div>

                {/* Next Meeting */}
                {group.nextMeeting && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-1">
                      Next Meeting
                    </div>
                    <div className="text-sm text-blue-700">
                      {new Date(group.nextMeeting.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-blue-600">
                      Topic: {group.nextMeeting.topic}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {group.recentActivity.slice(0, 2).map((activity, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-600">
                        {getActivityIcon(activity.type)}
                        <span className="ml-2 flex-1 truncate">{activity.description}</span>
                        <span className="ml-2 text-gray-400">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {group.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {group.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{group.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Led by {group.owner.name}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/study-group/${group.id}`} className="flex-1">
                    <Button 
                      variant={group.isJoined ? "secondary" : "primary"}
                      className="w-full"
                      size="sm"
                    >
                      {group.isJoined ? 'View Group' : 'Join Group'}
                    </Button>
                  </Link>
                  {group.isJoined && (
                    <Button variant="ghost" size="sm">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <FunnelIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or create a new study group
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Study Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationDashboard;