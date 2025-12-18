import 'package:flutter/material.dart';
import '../api/services.dart';

class TravelScreen extends StatefulWidget {
  const TravelScreen({super.key});

  @override
  State<TravelScreen> createState() => _TravelScreenState();
}

class _TravelScreenState extends State<TravelScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _myTrips = [];
  List<dynamic> _allTrips = [];
  bool _isLoading = true;
  String? _error;
  dynamic _selectedTrip;

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
      final myTripsResponse = await travelService.getMyTrips();
      final allTripsResponse = await travelService.getTrips();

      setState(() {
        _myTrips = myTripsResponse['data'] ?? [];
        _allTrips = allTripsResponse['data'] ?? [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  void _showCreateTripDialog() {
    final destinationController = TextEditingController();
    final purposeController = TextEditingController();
    final costController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Request Business Trip'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: destinationController,
                decoration: const InputDecoration(labelText: 'Destination'),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: purposeController,
                decoration: const InputDecoration(labelText: 'Purpose'),
                maxLines: 2,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: costController,
                decoration: const InputDecoration(
                  labelText: 'Estimated Cost',
                  prefixText: '\$',
                ),
                keyboardType: TextInputType.number,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              try {
                final now = DateTime.now();
                await travelService.createTrip({
                  'destination': destinationController.text,
                  'purpose': purposeController.text,
                  'start_date': now.toIso8601String().split('T')[0],
                  'end_date': now.add(const Duration(days: 3)).toIso8601String().split('T')[0],
                  'estimated_cost': double.tryParse(costController.text) ?? 0,
                });
                if (mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Trip request submitted')),
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
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_selectedTrip != null) {
      return _buildDetailView();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'My Trips'),
            Tab(text: 'All Trips'),
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
                    _buildTripsList(_myTrips, 'No trips found'),
                    _buildTripsList(_allTrips, 'No trips found'),
                  ],
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreateTripDialog,
        backgroundColor: const Color(0xFF2563EB),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildTripsList(List<dynamic> trips, String emptyMessage) {
    if (trips.isEmpty) {
      return Center(child: Text(emptyMessage));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: trips.length,
        itemBuilder: (context, index) {
          final trip = trips[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: Color(0xFF2563EB),
                child: Icon(Icons.flight, color: Colors.white),
              ),
              title: Text(
                trip['destination'] ?? 'Unknown Destination',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(trip['purpose'] ?? 'No purpose specified'),
                  Text(
                    '${trip['start_date'] ?? 'N/A'} - ${trip['end_date'] ?? 'N/A'}',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
              trailing: _buildStatusBadge(trip['status'] ?? 'unknown'),
              onTap: () {
                setState(() {
                  _selectedTrip = trip;
                });
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildDetailView() {
    final trip = _selectedTrip;
    return Scaffold(
      appBar: AppBar(
        title: Text(trip['destination'] ?? 'Trip Details'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            setState(() {
              _selectedTrip = null;
            });
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const CircleAvatar(
                          radius: 30,
                          backgroundColor: Color(0xFF2563EB),
                          child: Icon(Icons.flight, color: Colors.white, size: 30),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                trip['destination'] ?? 'Unknown',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              _buildStatusBadge(trip['status'] ?? 'unknown'),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Divider(),
                    _buildDetailRow('Purpose', trip['purpose'] ?? 'N/A'),
                    _buildDetailRow('Start Date', trip['start_date'] ?? 'N/A'),
                    _buildDetailRow('End Date', trip['end_date'] ?? 'N/A'),
                    if (trip['estimated_cost'] != null)
                      _buildDetailRow('Estimated Cost', '\$${trip['estimated_cost']}'),
                    if (trip['actual_cost'] != null)
                      _buildDetailRow('Actual Cost', '\$${trip['actual_cost']}'),
                    if (trip['notes'] != null)
                      _buildDetailRow('Notes', trip['notes']),
                  ],
                ),
              ),
            ),
            if (trip['staff_member'] != null) ...[
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Traveler',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Divider(),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: CircleAvatar(
                          backgroundColor: Colors.grey[300],
                          child: Text(
                            '${trip['staff_member']['first_name']?[0] ?? ''}${trip['staff_member']['last_name']?[0] ?? ''}'.toUpperCase(),
                          ),
                        ),
                        title: Text(
                          '${trip['staff_member']['first_name']} ${trip['staff_member']['last_name']}',
                        ),
                        subtitle: Text(trip['staff_member']['work_email'] ?? ''),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            if (trip['status'] == 'pending') ...[
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    try {
                      await travelService.cancelTrip(trip['id']);
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Trip cancelled')),
                        );
                        setState(() {
                          _selectedTrip = null;
                        });
                        _loadData();
                      }
                    } catch (e) {
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Error: $e')),
                        );
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Cancel Trip'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(color: Colors.grey),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        color = Colors.green;
        break;
      case 'pending':
        color = Colors.orange;
        break;
      case 'rejected':
      case 'cancelled':
        color = Colors.red;
        break;
      case 'in_progress':
        color = Colors.blue;
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
