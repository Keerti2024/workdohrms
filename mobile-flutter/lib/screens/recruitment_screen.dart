import 'package:flutter/material.dart';
import '../api/services.dart';

class RecruitmentScreen extends StatefulWidget {
  const RecruitmentScreen({super.key});

  @override
  State<RecruitmentScreen> createState() => _RecruitmentScreenState();
}

class _RecruitmentScreenState extends State<RecruitmentScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _jobs = [];
  List<dynamic> _applications = [];
  bool _isLoading = true;
  String? _error;
  dynamic _selectedJob;

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
      final jobsResponse = await recruitmentService.getJobs();
      final applicationsResponse = await recruitmentService.getApplications();

      setState(() {
        _jobs = jobsResponse['data'] ?? [];
        _applications = applicationsResponse['data'] ?? [];
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
    if (_selectedJob != null) {
      return _buildJobDetailView();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Recruitment'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'Jobs'),
            Tab(text: 'Applications'),
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
                    _buildJobsTab(),
                    _buildApplicationsTab(),
                  ],
                ),
    );
  }

  Widget _buildJobsTab() {
    if (_jobs.isEmpty) {
      return const Center(child: Text('No jobs found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _jobs.length,
        itemBuilder: (context, index) {
          final job = _jobs[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              title: Text(
                job['title'] ?? 'Untitled',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${job['positions'] ?? 0} positions'),
                  if (job['salary_from'] != null && job['salary_to'] != null)
                    Text('\$${job['salary_from']} - \$${job['salary_to']}'),
                ],
              ),
              trailing: _buildStatusBadge(job['status'] ?? 'unknown'),
              onTap: () {
                setState(() {
                  _selectedJob = job;
                });
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildApplicationsTab() {
    if (_applications.isEmpty) {
      return const Center(child: Text('No applications found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _applications.length,
        itemBuilder: (context, index) {
          final app = _applications[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: const Color(0xFF2563EB),
                child: Text(
                  (app['candidate']?['name']?[0] ?? 'C').toUpperCase(),
                  style: const TextStyle(color: Colors.white),
                ),
              ),
              title: Text(app['candidate']?['name'] ?? 'Unknown'),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(app['job']?['title'] ?? 'Unknown Job'),
                  Text(
                    'Applied: ${app['applied_at'] ?? 'N/A'}',
                    style: const TextStyle(fontSize: 12),
                  ),
                ],
              ),
              trailing: _buildStatusBadge(app['status'] ?? 'unknown'),
            ),
          );
        },
      ),
    );
  }

  Widget _buildJobDetailView() {
    final job = _selectedJob;
    return Scaffold(
      appBar: AppBar(
        title: Text(job['title'] ?? 'Job Details'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            setState(() {
              _selectedJob = null;
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
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          job['title'] ?? 'Untitled',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        _buildStatusBadge(job['status'] ?? 'unknown'),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildDetailRow('Positions', '${job['positions'] ?? 0}'),
                    _buildDetailRow('Start Date', job['start_date'] ?? 'N/A'),
                    if (job['end_date'] != null)
                      _buildDetailRow('End Date', job['end_date']),
                    if (job['salary_from'] != null)
                      _buildDetailRow(
                        'Salary Range',
                        '\$${job['salary_from']} - \$${job['salary_to'] ?? 'N/A'}',
                      ),
                    _buildDetailRow(
                      'Applications',
                      '${job['applications_count'] ?? 0}',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (job['description'] != null) ...[
              const Text(
                'Description',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(job['description']),
                ),
              ),
            ],
            const SizedBox(height: 16),
            if (job['requirements'] != null) ...[
              const Text(
                'Requirements',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(job['requirements']),
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
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.grey),
          ),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status.toLowerCase()) {
      case 'published':
      case 'hired':
        color = Colors.green;
        break;
      case 'draft':
      case 'applied':
        color = Colors.orange;
        break;
      case 'closed':
      case 'rejected':
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
        status.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
