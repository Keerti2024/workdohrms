import 'package:flutter/material.dart';
import '../api/services.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _workLogs = [];
  List<dynamic> _shifts = [];
  dynamic _myShift;
  bool _isLoading = true;
  String? _error;
  bool _isClockedIn = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
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
      final workLogsResponse = await attendanceService.getWorkLogs();
      final shiftsResponse = await attendanceService.getShifts();

      setState(() {
        _workLogs = workLogsResponse['data'] ?? [];
        _shifts = shiftsResponse['data'] ?? [];
        _isLoading = false;

        if (_workLogs.isNotEmpty) {
          final today = DateTime.now().toIso8601String().split('T')[0];
          final todayLog = _workLogs.firstWhere(
            (log) => log['log_date'] == today,
            orElse: () => null,
          );
          if (todayLog != null) {
            _isClockedIn = todayLog['clock_in'] != null && todayLog['clock_out'] == null;
          }
        }
      });

      try {
        final myShiftResponse = await attendanceService.getMyShift();
        setState(() {
          _myShift = myShiftResponse['data'];
        });
      } catch (e) {
        // My shift might not be available
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _handleClockIn() async {
    try {
      await attendanceService.clockIn();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Clocked in successfully')),
        );
        _loadData();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  Future<void> _handleClockOut() async {
    try {
      await attendanceService.clockOut();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Clocked out successfully')),
        );
        _loadData();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'Work Logs'),
            Tab(text: 'Shifts'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : Column(
                  children: [
                    _buildClockCard(),
                    Expanded(
                      child: TabBarView(
                        controller: _tabController,
                        children: [
                          _buildWorkLogsTab(),
                          _buildShiftsTab(),
                        ],
                      ),
                    ),
                  ],
                ),
    );
  }

  Widget _buildClockCard() {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              _isClockedIn ? 'You are clocked in' : 'You are not clocked in',
              style: TextStyle(
                fontSize: 16,
                color: _isClockedIn ? Colors.green : Colors.grey,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isClockedIn ? null : _handleClockIn,
                    icon: const Icon(Icons.login),
                    label: const Text('Clock In'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isClockedIn ? _handleClockOut : null,
                    icon: const Icon(Icons.logout),
                    label: const Text('Clock Out'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
            if (_myShift != null) ...[
              const SizedBox(height: 12),
              Text(
                'Your shift: ${_myShift['name']} (${_myShift['start_time']} - ${_myShift['end_time']})',
                style: const TextStyle(color: Colors.grey),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildWorkLogsTab() {
    if (_workLogs.isEmpty) {
      return const Center(child: Text('No work logs found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _workLogs.length,
        itemBuilder: (context, index) {
          final log = _workLogs[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: _getStatusColor(log['status']),
                child: Icon(
                  _getStatusIcon(log['status']),
                  color: Colors.white,
                ),
              ),
              title: Text(
                log['log_date'] ?? 'N/A',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.login, size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(log['clock_in'] ?? 'Not clocked in'),
                      const SizedBox(width: 16),
                      const Icon(Icons.logout, size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(log['clock_out'] ?? 'Not clocked out'),
                    ],
                  ),
                  if (log['clock_in'] != null && log['clock_out'] != null)
                    Text(
                      'Duration: ${_calculateDuration(log['clock_in'], log['clock_out'])}',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                ],
              ),
              trailing: _buildStatusBadge(log['status'] ?? 'unknown'),
            ),
          );
        },
      ),
    );
  }

  Widget _buildShiftsTab() {
    if (_shifts.isEmpty) {
      return const Center(child: Text('No shifts found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _shifts.length,
        itemBuilder: (context, index) {
          final shift = _shifts[index];
          final isMyShift = _myShift != null && _myShift['id'] == shift['id'];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            color: isMyShift ? const Color(0xFF2563EB).withOpacity(0.1) : null,
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: isMyShift ? const Color(0xFF2563EB) : Colors.grey,
                child: const Icon(Icons.schedule, color: Colors.white),
              ),
              title: Row(
                children: [
                  Text(
                    shift['name'] ?? 'Unnamed Shift',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  if (isMyShift) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2563EB),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'YOUR SHIFT',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${shift['start_time'] ?? 'N/A'} - ${shift['end_time'] ?? 'N/A'}'),
                  if (shift['break_duration'] != null)
                    Text(
                      'Break: ${shift['break_duration']} minutes',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  String _calculateDuration(String clockIn, String clockOut) {
    try {
      final inParts = clockIn.split(':');
      final outParts = clockOut.split(':');
      final inMinutes = int.parse(inParts[0]) * 60 + int.parse(inParts[1]);
      final outMinutes = int.parse(outParts[0]) * 60 + int.parse(outParts[1]);
      final duration = outMinutes - inMinutes;
      final hours = duration ~/ 60;
      final minutes = duration % 60;
      return '${hours}h ${minutes}m';
    } catch (e) {
      return 'N/A';
    }
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'present':
        return Colors.green;
      case 'absent':
        return Colors.red;
      case 'late':
        return Colors.orange;
      case 'half_day':
        return Colors.amber;
      case 'leave':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String? status) {
    switch (status?.toLowerCase()) {
      case 'present':
        return Icons.check;
      case 'absent':
        return Icons.close;
      case 'late':
        return Icons.access_time;
      case 'half_day':
        return Icons.timelapse;
      case 'leave':
        return Icons.beach_access;
      default:
        return Icons.help_outline;
    }
  }

  Widget _buildStatusBadge(String status) {
    Color color = _getStatusColor(status);

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
