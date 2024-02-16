/**
 * This error might occur when the activityID is not found onto the activity context.
 */
export class ActivityNotFoundError extends Error
{
    constructor(activityId: string) {
        super("Session with id "+activityId+" has not been found");
    }
}