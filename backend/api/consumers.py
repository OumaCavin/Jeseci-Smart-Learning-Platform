"""
WebSocket consumers for real-time communication.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get parameters from query string
        query_string = self.scope['query_string'].decode()
        params = dict(x.split('=') for x in query_string.split('&') if '=' in x)
        
        self.room_name = params.get('room', 'general')
        self.user_id = params.get('user_id', 'anonymous')
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = self.scope["user"].username if self.scope["user"].is_authenticated else "Anonymous"

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get parameters from query string
        query_string = self.scope['query_string'].decode()
        params = dict(x.split('=') for x in query_string.split('&') if '=' in x)
        
        self.user_id = params.get('user_id', 'anonymous')
        self.room_group_name = f'notifications_{self.user_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive notification from room group
    async def send_notification(self, event):
        notification = event['notification']

        # Send notification to WebSocket
        await self.send(text_data=json.dumps({
            'notification': notification
        }))