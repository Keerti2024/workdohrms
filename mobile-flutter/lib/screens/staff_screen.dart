import 'package:flutter/material.dart';
import '../api/services.dart';

class StaffScreen extends StatefulWidget {
  const StaffScreen({super.key});

  @override
  State<StaffScreen> createState() => _StaffScreenState();
}

class _StaffScreenState extends State<StaffScreen> {
  List<dynamic> _staffMembers = [];
  List<dynamic> _filteredStaff = [];
  bool _isLoading = true;
  String? _error;
  final TextEditingController _searchController = TextEditingController();
  dynamic _selectedStaff;

  @override
  void initState() {
    super.initState();
    _loadData();
    _searchController.addListener(_filterStaff);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await staffService.getStaffMembers();
      setState(() {
        _staffMembers = response['data'] ?? [];
        _filteredStaff = _staffMembers;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  void _filterStaff() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredStaff = _staffMembers.where((staff) {
        final name = '${staff['first_name']} ${staff['last_name']}'.toLowerCase();
        final email = (staff['work_email'] ?? '').toLowerCase();
        return name.contains(query) || email.contains(query);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_selectedStaff != null) {
      return _buildDetailView();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Staff Directory'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search by name or email...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[100],
              ),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(child: Text('Error: $_error'))
                    : _filteredStaff.isEmpty
                        ? const Center(child: Text('No staff members found'))
                        : RefreshIndicator(
                            onRefresh: _loadData,
                            child: ListView.builder(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: _filteredStaff.length,
                              itemBuilder: (context, index) {
                                final staff = _filteredStaff[index];
                                return _buildStaffCard(staff);
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  Widget _buildStaffCard(dynamic staff) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: const Color(0xFF2563EB),
          child: Text(
            '${staff['first_name']?[0] ?? ''}${staff['last_name']?[0] ?? ''}'.toUpperCase(),
            style: const TextStyle(color: Colors.white),
          ),
        ),
        title: Text('${staff['first_name']} ${staff['last_name']}'),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(staff['work_email'] ?? 'No email'),
            if (staff['job_title'] != null)
              Text(
                staff['job_title']['name'] ?? '',
                style: const TextStyle(color: Color(0xFF2563EB)),
              ),
          ],
        ),
        trailing: _buildStatusBadge(staff['employment_status'] ?? 'unknown'),
        onTap: () {
          setState(() {
            _selectedStaff = staff;
          });
        },
      ),
    );
  }

  Widget _buildDetailView() {
    final staff = _selectedStaff;
    return Scaffold(
      appBar: AppBar(
        title: Text('${staff['first_name']} ${staff['last_name']}'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            setState(() {
              _selectedStaff = null;
            });
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: CircleAvatar(
                radius: 50,
                backgroundColor: const Color(0xFF2563EB),
                child: Text(
                  '${staff['first_name']?[0] ?? ''}${staff['last_name']?[0] ?? ''}'.toUpperCase(),
                  style: const TextStyle(color: Colors.white, fontSize: 32),
                ),
              ),
            ),
            const SizedBox(height: 24),
            _buildInfoSection('Personal Information', [
              _buildInfoRow('Name', '${staff['first_name']} ${staff['last_name']}'),
              _buildInfoRow('Staff Code', staff['staff_code'] ?? 'N/A'),
              _buildInfoRow('Email', staff['work_email'] ?? 'N/A'),
              _buildInfoRow('Phone', staff['phone_number'] ?? 'N/A'),
            ]),
            const SizedBox(height: 16),
            _buildInfoSection('Employment Details', [
              _buildInfoRow('Status', staff['employment_status'] ?? 'N/A'),
              _buildInfoRow('Hire Date', staff['hire_date'] ?? 'N/A'),
              if (staff['job_title'] != null)
                _buildInfoRow('Job Title', staff['job_title']['name'] ?? 'N/A'),
              if (staff['division'] != null)
                _buildInfoRow('Division', staff['division']['name'] ?? 'N/A'),
              if (staff['office_location'] != null)
                _buildInfoRow('Location', staff['office_location']['title'] ?? 'N/A'),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoSection(String title, List<Widget> children) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Divider(),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.grey,
                fontWeight: FontWeight.w500,
              ),
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
      case 'active':
        color = Colors.green;
        break;
      case 'on_leave':
        color = Colors.orange;
        break;
      case 'terminated':
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
