import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { fetchStudyGroup, joinGroup, leaveGroup } from '../../store/slices/collaborationSlice';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  UserPlusIcon,
  UserMinusIcon,
  ShareIcon,
  CogIcon,
  BellIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  PaperAirplaneIcon
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
    duration: number;
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
    isAttending: boolean;
  };
  members: {
    id: string;
    name: string;
    avatar?: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
    isOnline: boolean;
  }[];
  upcomingMeetings: {
    id: string;
    date: Date;
    topic: string;
    attendees: number;
  }[];
  chatMessages: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: Date;
    type: 'text' | 'system' | 'file';
  }[];
  resources: {
    id: string;
    title: string;
    type: 'document' | 'link' | 'video' | 'image';
    url: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];
  createdAt: Date;
  tags: string[];
}

const StudyGroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentGroup, loading } = useSelector((state: RootState) => state.collaboration);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'meetings' | 'resources' | 'members'>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchStudyGroup(id));
    }
  }, [dispatch, id]);

  const handleJoinGroup = async () => {
    if (!currentGroup) return;
    try {
      await dispatch(joinGroup(currentGroup.id));
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentGroup) return;
    try {
      await dispatch(leaveGroup(currentGroup.id));
      navigate('/collaboration');
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentGroup) return;
    
    // Add message to chat (would call API in real implementation)
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading study group...</p>
        </div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Study Group Not Found</h3>
          <p className="text-gray-600 mb-4">The requested study group could not be found.</p>
          <Link to="/collaboration">
            <Button>Back to Study Groups</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const canManage = currentGroup.owner.id === user?.id;
  const isOwner = currentGroup.owner.id === user?.id;
  const isAdmin = currentGroup.members.find(m => m.id === user?.id)?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/collaboration">
            <Button variant="ghost" className="mb-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Study Groups
            </Button>
          </Link>
        </div>

        {/* Header */}
        <Card className="mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-3">
                    {currentGroup.subject}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentGroup.privacy === 'private' 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {currentGroup.privacy}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {currentGroup.name}
                </h1>
                
                <p className="text-gray-600 text-lg mb-4">
                  {currentGroup.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    <span>{currentGroup.memberCount} members</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>Created {new Date(currentGroup.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                {currentGroup.isJoined ? (
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm">
                      <ShareIcon className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    {(canManage || isAdmin) && (
                      <Button variant="secondary" size="sm">
                        <CogIcon className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    )}
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setShowLeaveConfirm(true)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <UserMinusIcon className="w-4 h-4 mr-2" />
                      Leave
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleJoinGroup}>
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Join Group
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: UserGroupIcon },
                { id: 'chat', name: 'Chat', icon: ChatBubbleLeftRightIcon },
                { id: 'meetings', name: 'Meetings', icon: CalendarIcon },
                { id: 'resources', name: 'Resources', icon: PaperAirplaneIcon },
                { id: 'members', name: 'Members', icon: UserGroupIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Next Meeting */}
                {currentGroup.nextMeeting && (
                  <Card>
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Meeting</h2>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-blue-900">{currentGroup.nextMeeting.topic}</h3>
                            <p className="text-blue-700">
                              {new Date(currentGroup.nextMeeting.date).toLocaleDateString()} at{' '}
                              {new Date(currentGroup.nextMeeting.date).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            <p className="text-sm text-blue-600">
                              {currentGroup.nextMeeting.attendees} attending
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm">
                              <VideoCameraIcon className="w-4 h-4 mr-2" />
                              Join
                            </Button>
                            {currentGroup.isJoined && !currentGroup.nextMeeting.isAttending && (
                              <Button variant="secondary" size="sm">
                                Attend
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Meeting Schedule */}
                <Card>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Meeting Schedule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Frequency</p>
                        <p className="font-medium capitalize">{currentGroup.meetingSchedule.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Day & Time</p>
                        <p className="font-medium">
                          {currentGroup.meetingSchedule.day}s at {formatTime(currentGroup.meetingSchedule.time)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{currentGroup.meetingSchedule.duration} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Timezone</p>
                        <p className="font-medium">{currentGroup.meetingSchedule.timezone}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Location */}
                {currentGroup.location && (
                  <Card>
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                      <div className="flex items-center">
                        <MapPinIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="capitalize">{currentGroup.location.type}</span>
                        {currentGroup.location.platform && (
                          <span className="ml-2 text-gray-600">via {currentGroup.location.platform}</span>
                        )}
                        {currentGroup.location.address && (
                          <span className="ml-2 text-gray-600">at {currentGroup.location.address}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <Card className="h-96 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Group Chat</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentGroup.chatMessages.map((message) => (
                    <div key={message.id} className="flex">
                      <div className={`flex-1 ${message.userId === user?.id ? 'text-right' : ''}`}>
                        <div className={`inline-block p-3 rounded-lg ${
                          message.userId === user?.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.userName} • {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            )}

            {activeTab === 'members' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Members ({currentGroup.memberCount})
                  </h2>
                  <div className="space-y-4">
                    {currentGroup.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {member.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === 'meetings' || activeTab === 'resources') && (
              <Card>
                <div className="p-8 text-center">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon
                  </h2>
                  <p className="text-gray-600">
                    This feature is currently under development.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Members</span>
                    <span className="font-medium">{currentGroup.memberCount}/{currentGroup.maxMembers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Meetings</span>
                    <span className="font-medium">{currentGroup.upcomingMeetings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Messages</span>
                    <span className="font-medium">{currentGroup.chatMessages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resources</span>
                    <span className="font-medium">{currentGroup.resources.length}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tags */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentGroup.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Notifications */}
            {currentGroup.isJoined && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">New messages</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Meeting reminders</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">New members</span>
                    </label>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Study Group</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to leave "{currentGroup.name}"? You'll lose access to all group content and discussions.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLeaveGroup}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Leave Group
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudyGroupDetail;