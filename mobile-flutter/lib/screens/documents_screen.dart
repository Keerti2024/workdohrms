import 'package:flutter/material.dart';
import '../api/services.dart';

class DocumentsScreen extends StatefulWidget {
  const DocumentsScreen({super.key});

  @override
  State<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends State<DocumentsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _documents = [];
  List<dynamic> _categories = [];
  List<dynamic> _letters = [];
  bool _isLoading = true;
  String? _error;
  int? _selectedCategoryId;

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
      final documentsResponse = await documentService.getDocuments();
      final categoriesResponse = await documentService.getCategories();
      final lettersResponse = await documentService.getMyLetters();

      setState(() {
        _documents = documentsResponse['data'] ?? [];
        _categories = categoriesResponse['data'] ?? [];
        _letters = lettersResponse['data'] ?? [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  List<dynamic> get _filteredDocuments {
    if (_selectedCategoryId == null) {
      return _documents;
    }
    return _documents.where((doc) => doc['category']?['id'] == _selectedCategoryId).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Documents'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'HR Documents'),
            Tab(text: 'My Letters'),
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
                    _buildDocumentsTab(),
                    _buildLettersTab(),
                  ],
                ),
    );
  }

  Widget _buildDocumentsTab() {
    return Column(
      children: [
        if (_categories.isNotEmpty)
          Container(
            height: 50,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _categories.length + 1,
              itemBuilder: (context, index) {
                if (index == 0) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: const Text('All'),
                      selected: _selectedCategoryId == null,
                      onSelected: (selected) {
                        setState(() {
                          _selectedCategoryId = null;
                        });
                      },
                      selectedColor: const Color(0xFF2563EB).withOpacity(0.2),
                    ),
                  );
                }
                final category = _categories[index - 1];
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(category['name'] ?? 'Unknown'),
                    selected: _selectedCategoryId == category['id'],
                    onSelected: (selected) {
                      setState(() {
                        _selectedCategoryId = selected ? category['id'] : null;
                      });
                    },
                    selectedColor: const Color(0xFF2563EB).withOpacity(0.2),
                  ),
                );
              },
            ),
          ),
        Expanded(
          child: _filteredDocuments.isEmpty
              ? const Center(child: Text('No documents found'))
              : RefreshIndicator(
                  onRefresh: _loadData,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filteredDocuments.length,
                    itemBuilder: (context, index) {
                      final doc = _filteredDocuments[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: const Color(0xFF2563EB),
                            child: Icon(
                              _getFileIcon(doc['file_type']),
                              color: Colors.white,
                            ),
                          ),
                          title: Text(
                            doc['title'] ?? 'Untitled Document',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (doc['category'] != null)
                                Text(doc['category']['name'] ?? ''),
                              Text(
                                doc['created_at'] ?? 'N/A',
                                style: const TextStyle(fontSize: 12, color: Colors.grey),
                              ),
                            ],
                          ),
                          trailing: IconButton(
                            icon: const Icon(Icons.download),
                            onPressed: () {
                              // Download document
                            },
                          ),
                        ),
                      );
                    },
                  ),
                ),
        ),
      ],
    );
  }

  Widget _buildLettersTab() {
    if (_letters.isEmpty) {
      return const Center(child: Text('No letters found'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _letters.length,
        itemBuilder: (context, index) {
          final letter = _letters[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: Colors.green,
                child: Icon(Icons.mail, color: Colors.white),
              ),
              title: Text(
                letter['title'] ?? 'Untitled Letter',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (letter['letter_type'] != null)
                    Text(letter['letter_type']),
                  Text(
                    letter['created_at'] ?? 'N/A',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
              trailing: IconButton(
                icon: const Icon(Icons.download),
                onPressed: () {
                  // Download letter
                },
              ),
            ),
          );
        },
      ),
    );
  }

  IconData _getFileIcon(String? fileType) {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return Icons.picture_as_pdf;
      case 'doc':
      case 'docx':
        return Icons.description;
      case 'xls':
      case 'xlsx':
        return Icons.table_chart;
      case 'ppt':
      case 'pptx':
        return Icons.slideshow;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Icons.image;
      default:
        return Icons.insert_drive_file;
    }
  }
}
