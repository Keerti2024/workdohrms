import 'package:flutter/material.dart';
import '../api/services.dart';

class OrganizationScreen extends StatefulWidget {
  const OrganizationScreen({super.key});

  @override
  State<OrganizationScreen> createState() => _OrganizationScreenState();
}

class _OrganizationScreenState extends State<OrganizationScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _locations = [];
  List<dynamic> _divisions = [];
  List<dynamic> _policies = [];
  bool _isLoading = true;
  String? _error;
  dynamic _selectedLocation;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
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
      final locationsResponse = await organizationService.getLocations();
      final divisionsResponse = await organizationService.getDivisions();
      final policiesResponse = await organizationService.getPolicies();

      setState(() {
        _locations = locationsResponse['data'] ?? [];
        _divisions = divisionsResponse['data'] ?? [];
        _policies = policiesResponse['data'] ?? [];
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
    if (_selectedLocation != null) {
      return _buildLocationDetailView();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Organization'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'Locations'),
            Tab(text: 'Divisions'),
            Tab(text: 'Policies'),
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
                    _buildLocationsTab(),
                    _buildDivisionsTab(),
                    _buildPoliciesTab(),
                  ],
                ),
    );
  }

  Widget _buildLocationsTab() {
    if (_locations.isEmpty) {
      return const Center(child: Text('No locations found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _locations.length,
        itemBuilder: (context, index) {
          final location = _locations[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: Color(0xFF2563EB),
                child: Icon(Icons.location_on, color: Colors.white),
              ),
              title: Text(
                location['title'] ?? 'Unnamed Location',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (location['address'] != null)
                    Text(location['address']),
                  if (location['city'] != null || location['country'] != null)
                    Text(
                      '${location['city'] ?? ''}, ${location['country'] ?? ''}'.trim(),
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                ],
              ),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                setState(() {
                  _selectedLocation = location;
                });
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildDivisionsTab() {
    if (_divisions.isEmpty) {
      return const Center(child: Text('No divisions found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _divisions.length,
        itemBuilder: (context, index) {
          final division = _divisions[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: Colors.green,
                child: Icon(Icons.business, color: Colors.white),
              ),
              title: Text(
                division['name'] ?? 'Unnamed Division',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(division['description'] ?? 'No description'),
            ),
          );
        },
      ),
    );
  }

  Widget _buildPoliciesTab() {
    if (_policies.isEmpty) {
      return const Center(child: Text('No policies found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _policies.length,
        itemBuilder: (context, index) {
          final policy = _policies[index];
          final isAcknowledged = policy['is_acknowledged'] == true;
          final isMandatory = policy['is_mandatory'] == true;
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          policy['title'] ?? 'Untitled Policy',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                      if (isMandatory)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.red.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'MANDATORY',
                            style: TextStyle(
                              color: Colors.red,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    policy['description'] ?? '',
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Effective: ${policy['effective_date'] ?? 'N/A'}',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  const SizedBox(height: 12),
                  if (isAcknowledged)
                    Row(
                      children: [
                        const Icon(Icons.check_circle, color: Colors.green, size: 20),
                        const SizedBox(width: 4),
                        const Text(
                          'Acknowledged',
                          style: TextStyle(color: Colors.green),
                        ),
                      ],
                    )
                  else
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () async {
                          try {
                            await organizationService.acknowledgePolicy(policy['id']);
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Policy acknowledged')),
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
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Acknowledge'),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLocationDetailView() {
    final location = _selectedLocation;
    final locationDivisions = _divisions
        .where((d) => d['office_location_id'] == location['id'])
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(location['title'] ?? 'Location Details'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            setState(() {
              _selectedLocation = null;
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
                          child: Icon(Icons.location_on, color: Colors.white, size: 30),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            location['title'] ?? 'Unnamed',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Divider(),
                    _buildDetailRow('Address', location['address'] ?? 'N/A'),
                    _buildDetailRow('City', location['city'] ?? 'N/A'),
                    _buildDetailRow('Country', location['country'] ?? 'N/A'),
                    if (location['phone'] != null)
                      _buildDetailRow('Phone', location['phone']),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Divisions (${locationDivisions.length})',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            if (locationDivisions.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No divisions in this location'),
                ),
              )
            else
              ...locationDivisions.map((division) => Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      leading: const CircleAvatar(
                        backgroundColor: Colors.green,
                        child: Icon(Icons.business, color: Colors.white),
                      ),
                      title: Text(division['name'] ?? 'Unnamed'),
                      subtitle: Text(division['description'] ?? ''),
                    ),
                  )),
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
            width: 100,
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
}
