import 'package:flutter/material.dart';
import '../api/services.dart';

class CompanyScreen extends StatefulWidget {
  const CompanyScreen({super.key});

  @override
  State<CompanyScreen> createState() => _CompanyScreenState();
}

class _CompanyScreenState extends State<CompanyScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _events = [];
  List<dynamic> _holidays = [];
  List<dynamic> _notices = [];
  List<dynamic> _meetings = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final eventsResponse = await companyService.getEvents();
      final holidaysResponse = await companyService.getHolidays();
      final noticesResponse = await companyService.getNotices();
      final meetingsResponse = await companyService.getMeetings();

      setState(() {
        _events = eventsResponse['data'] ?? [];
        _holidays = holidaysResponse['data'] ?? [];
        _notices = noticesResponse['data'] ?? [];
        _meetings = meetingsResponse['data'] ?? [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Company'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          isScrollable: true,
          tabs: const [
            Tab(text: 'Events'),
            Tab(text: 'Holidays'),
            Tab(text: 'Notices'),
            Tab(text: 'Meetings'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildEventsTab(),
                    _buildHolidaysTab(),
                    _buildNoticesTab(),
                    _buildMeetingsTab(),
                  ],
                ),
    );
  }

  Widget _buildEventsTab() {
    if (_events.isEmpty) {
      return const Center(child: Text('No events found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _events.length,
        itemBuilder: (context, index) {
          final event = _events[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: const Color(0xFF2563EB),
                child: Icon(
                  _getEventIcon(event['event_type']),
                  color: Colors.white,
                ),
              ),
              title: Text(
                event['title'] ?? 'Untitled Event',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(event['start_date'] ?? 'N/A'),
                  if (event['location'] != null)
                    Text(
                      event['location'],
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                ],
              ),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF2563EB).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  event['event_type']?.toUpperCase() ?? 'EVENT',
                  style: const TextStyle(
                    color: Color(0xFF2563EB),
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildHolidaysTab() {
    if (_holidays.isEmpty) {
      return const Center(child: Text('No holidays found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _holidays.length,
        itemBuilder: (context, index) {
          final holiday = _holidays[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: Colors.green,
                child: Icon(Icons.celebration, color: Colors.white),
              ),
              title: Text(
                holiday['name'] ?? 'Unnamed Holiday',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(holiday['date'] ?? 'N/A'),
              trailing: holiday['is_recurring'] == true
                  ? Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.purple.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'RECURRING',
                        style: TextStyle(
                          color: Colors.purple,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    )
                  : null,
            ),
          );
        },
      ),
    );
  }

  Widget _buildNoticesTab() {
    if (_notices.isEmpty) {
      return const Center(child: Text('No notices found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _notices.length,
        itemBuilder: (context, index) {
          final notice = _notices[index];
          final isRead = notice['is_read'] == true;
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: isRead ? Colors.grey : Colors.orange,
                child: Icon(
                  isRead ? Icons.mark_email_read : Icons.mark_email_unread,
                  color: Colors.white,
                ),
              ),
              title: Row(
                children: [
                  Expanded(
                    child: Text(
                      notice['title'] ?? 'Untitled Notice',
                      style: TextStyle(
                        fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                      ),
                    ),
                  ),
                  if (!isRead)
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                ],
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    notice['description'] ?? '',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    notice['created_at'] ?? 'N/A',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
              onTap: () async {
                if (!isRead) {
                  try {
                    await companyService.markNoticeRead(notice['id']);
                    _loadData();
                  } catch (e) {
                    // Handle error silently
                  }
                }
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildMeetingsTab() {
    if (_meetings.isEmpty) {
      return const Center(child: Text('No meetings found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _meetings.length,
        itemBuilder: (context, index) {
          final meeting = _meetings[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          meeting['title'] ?? 'Untitled Meeting',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                      _buildStatusBadge(meeting['status'] ?? 'unknown'),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(meeting['scheduled_date'] ?? 'N/A'),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.access_time, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text('${meeting['start_time'] ?? 'N/A'} - ${meeting['end_time'] ?? 'N/A'}'),
                    ],
                  ),
                  if (meeting['meeting_room'] != null) ...[
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.meeting_room, size: 16, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(meeting['meeting_room']['name'] ?? 'N/A'),
                      ],
                    ),
                  ],
                  if (meeting['meeting_link'] != null) ...[
                    const SizedBox(height: 8),
                    TextButton.icon(
                      onPressed: () {
                        // Open meeting link
                      },
                      icon: const Icon(Icons.video_call),
                      label: const Text('Join Meeting'),
                    ),
                  ],
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  IconData _getEventIcon(String? type) {
    switch (type?.toLowerCase()) {
      case 'meeting':
        return Icons.groups;
      case 'training':
        return Icons.school;
      case 'celebration':
        return Icons.celebration;
      case 'announcement':
        return Icons.campaign;
      default:
        return Icons.event;
    }
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status.toLowerCase()) {
      case 'scheduled':
        color = Colors.blue;
        break;
      case 'in_progress':
        color = Colors.green;
        break;
      case 'completed':
        color = Colors.grey;
        break;
      case 'cancelled':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status.replaceAll('_', ' ').toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
