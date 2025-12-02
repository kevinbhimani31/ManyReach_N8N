// Paste your controller method here (e.g., GetUsers)
// Example:
// [HttpGet, Route("")]
// public IHttpActionResult GetUsers([FromUri] Api2PaginationQuery<Guid?> pageQuery = null) { ... }


        #region POST /api/v2/tags - Create New Tag

        /// <summary>
        /// Creates a new tag
        /// </summary>
        /// <remarks>
        /// Creates a new tag for the authenticated organization.
        ///
        /// Behavior:
        /// - Authenticates API request
        /// - Validates tag title is unique within organization (case-insensitive)
        /// - Creates new tag
        /// - Returns created tag details
        /// </remarks>
        /// <param name="request">Tag creation request with title and optional description</param>
        /// <returns>Created tag details</returns>
        [HttpPost, Route("")]
        [SwaggerResponse(HttpStatusCode.Created, Description = "Tag created successfully", Type = typeof(Api2Tag))]
        public IHttpActionResult CreateTag([FromBody] Api2TagCreate request)
        {
            return ExecuteAuthenticated(org =>
            {
                // Check for duplicates and create tag
                try
                {
                    var existingTag = _tagRepo.GetTagByTitle(org.OrganizationID, request.Title);
                    if (existingTag != null)
                        throw new InvalidOperationException($"Tag with title '{request.Title}' already exists");

                    // Create tag
                    var tag = _tagRepo.CreateTag(org.OrganizationID, MapTo<EM_TAG>(request));

                    // clear cache
                    SendEmailRep.Get.Caching.Remove.TagList(org.OrganizationID);

                    var response = MapTo<Api2Tag>(tag);
                    return SuccessResponse<Api2Tag>(HttpStatusCode.Created, response);
                }
                catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
                {
                    return ErrorResponse(Api2ErrorType.DuplicateResource, ex.Message);
                }
            });
        }

        #endregion